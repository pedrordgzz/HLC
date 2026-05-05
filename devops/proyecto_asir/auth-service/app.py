"""
Auth Service - Microservicio de validación completa
====================================================

Funcionalidades:
- Validación de correo: formato + MX + listas negras locales + API dinámica + caché
- Validación de teléfono: formato internacional, longitud, número válido (lib phonenumbers)
- Sistema de logs centralizado por tipo de validación
- CRUD de blocklist global (inteligencia colectiva)
- Endpoint /global-blocklist para que microservicios cliente sincronicen sus listas
- Health check
- Caché en memoria con TTL para reducir llamadas a APIs externas
"""
import os
import sqlite3
import jwt
import datetime
import smtplib
import threading
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError
import requests
from disposable_email_domains import blocklist as PIP_BLOCKLIST
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
import phonenumbers
from phonenumbers import NumberParseException, carrier, geocoder

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'petstore_super_secret_key_123')

os.makedirs('data', exist_ok=True)
DB_FILE = 'data/users.db'
CUSTOM_BLOCKLIST_FILE = 'data/custom_blocklist.txt'

API_URL = os.environ.get('API_URL', 'http://localhost:5000')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# ════════════════════════════════════════════════════════════
#  CACHÉ EN MEMORIA (TTL) — reduce llamadas a APIs externas
# ════════════════════════════════════════════════════════════

_cache = {}
_cache_lock = threading.Lock()
CACHE_TTL = 3600  # 1 hora


def cache_get(key):
    with _cache_lock:
        entry = _cache.get(key)
        if entry and entry['expires_at'] > time.time():
            return entry['value']
        if entry:
            del _cache[key]
        return None


def cache_set(key, value, ttl=CACHE_TTL):
    with _cache_lock:
        _cache[key] = {'value': value, 'expires_at': time.time() + ttl}


# ════════════════════════════════════════════════════════════
#  UTILIDADES
# ════════════════════════════════════════════════════════════

def get_client_ip():
    return request.headers.get('X-Real-IP', request.remote_addr)


def log_attempt(target, ip, validation_type, result, message):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute(
            'INSERT INTO validation_logs (timestamp, target, validation_type, ip, result, message) '
            'VALUES (?, ?, ?, ?, ?, ?)',
            (datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
             target, validation_type, ip, result, message)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging attempt: {e}")


def get_custom_blocklist():
    if not os.path.exists(CUSTOM_BLOCKLIST_FILE):
        return set()
    with open(CUSTOM_BLOCKLIST_FILE, 'r', encoding='utf-8') as f:
        return set(line.strip().lower() for line in f if line.strip() and not line.startswith('#'))


def add_to_custom_blocklist(domain):
    domain = domain.strip().lower()
    if not domain:
        return False
    current = get_custom_blocklist()
    if domain in current:
        return False
    with open(CUSTOM_BLOCKLIST_FILE, 'a', encoding='utf-8') as f:
        f.write(f"{domain}\n")
    return True


def remove_from_custom_blocklist(domain):
    domain = domain.strip().lower()
    if not os.path.exists(CUSTOM_BLOCKLIST_FILE):
        return False
    with open(CUSTOM_BLOCKLIST_FILE, 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]
    if domain not in lines:
        return False
    with open(CUSTOM_BLOCKLIST_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(l for l in lines if l != domain) + '\n')
    return True


# ════════════════════════════════════════════════════════════
#  BASE DE DATOS
# ════════════════════════════════════════════════════════════

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            telefono TEXT NOT NULL,
            password TEXT NOT NULL,
            is_verified INTEGER DEFAULT 0
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS validation_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            target TEXT NOT NULL,
            validation_type TEXT NOT NULL DEFAULT 'email',
            ip TEXT,
            result TEXT NOT NULL,
            message TEXT
        )
    ''')
    # Migración: añadir columnas si la BD viene de versión anterior
    try:
        c.execute("ALTER TABLE validation_logs ADD COLUMN validation_type TEXT NOT NULL DEFAULT 'email'")
    except sqlite3.OperationalError:
        pass
    try:
        c.execute("ALTER TABLE validation_logs ADD COLUMN target TEXT")
        c.execute("UPDATE validation_logs SET target = email WHERE target IS NULL")
    except sqlite3.OperationalError:
        pass
    conn.commit()
    conn.close()


init_db()


# ════════════════════════════════════════════════════════════
#  VALIDACIONES
# ════════════════════════════════════════════════════════════

def validate_email_full(email, ip):
    """Valida correo: formato → MX → blocklist local → blocklist personalizada → API Debounce (con caché)"""
    try:
        valid = validate_email(email, check_deliverability=True)
        email = valid.normalized
        domain = email.split('@')[1].lower()

        # 1. Lista negra local (pip)
        domain_parts = domain.split('.')
        for i in range(len(domain_parts) - 1):
            check_domain = ".".join(domain_parts[i:])
            if check_domain in PIP_BLOCKLIST:
                log_attempt(email, ip, 'email', 'blocked_disposable',
                            f'Dominio en lista pip: {check_domain}')
                return False, 'No se permiten proveedores de correo temporal o desechable.', email

        # 2. Lista negra personalizada (admin del dashboard)
        custom = get_custom_blocklist()
        if domain in custom:
            log_attempt(email, ip, 'email', 'blocked_custom',
                        f'Dominio en lista personalizada: {domain}')
            return False, f'El dominio "{domain}" está bloqueado por la administración.', email

        # 3. API Debounce con caché
        cache_key = f'debounce:{domain}'
        cached = cache_get(cache_key)
        if cached is not None:
            is_disposable = cached
        else:
            is_disposable = False
            try:
                resp = requests.get(
                    f'https://disposable.debounce.io/?email={email}',
                    headers={'User-Agent': 'Mozilla/5.0'},
                    timeout=5
                )
                if resp.status_code == 200:
                    is_disposable = resp.json().get('disposable') == 'true'
                cache_set(cache_key, is_disposable)
            except requests.RequestException:
                pass

        if is_disposable:
            log_attempt(email, ip, 'email', 'blocked_disposable',
                        'Detectado por API Debounce')
            return False, 'No se permiten proveedores de correo temporal o desechable.', email

        return True, 'OK', email

    except EmailNotValidError as e:
        log_attempt(email, ip, 'email', 'blocked_format', str(e))
        return False, f'Email inválido: {str(e)}', email


def validate_phone_full(telefono, ip, default_region='ES'):
    """Valida teléfono: formato internacional, número válido, no premium/desechable"""
    try:
        # Acepta tanto formato internacional (+34...) como nacional (con default_region)
        parsed = phonenumbers.parse(telefono, default_region)
    except NumberParseException as e:
        log_attempt(telefono, ip, 'phone', 'blocked_format', str(e))
        return False, f'Número de teléfono inválido: {str(e)}'

    if not phonenumbers.is_possible_number(parsed):
        log_attempt(telefono, ip, 'phone', 'blocked_format', 'Longitud o estructura incorrecta')
        return False, 'El número de teléfono no es válido (longitud/estructura).'

    if not phonenumbers.is_valid_number(parsed):
        log_attempt(telefono, ip, 'phone', 'blocked_format',
                    'Número no asignado a ningún operador')
        return False, 'El número de teléfono no corresponde a un operador real.'

    # Detección de números premium / VoIP / sospechosos
    line_type = phonenumbers.number_type(parsed)
    blocked_types = {
        phonenumbers.PhoneNumberType.PREMIUM_RATE,
        phonenumbers.PhoneNumberType.SHARED_COST,
        phonenumbers.PhoneNumberType.UAN,
        phonenumbers.PhoneNumberType.VOICEMAIL,
    }
    if line_type in blocked_types:
        log_attempt(telefono, ip, 'phone', 'blocked_premium',
                    f'Número de tipo bloqueado: {line_type}')
        return False, 'Tipo de número no permitido (premium/coste compartido).'

    formatted = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
    return True, formatted


# ════════════════════════════════════════════════════════════
#  ENVÍO DE CORREO
# ════════════════════════════════════════════════════════════

def send_verification_email(user_email, token):
    verification_link = f"{API_URL}/api/auth/verify/{token}"
    print(f"\n{'='*60}\n[SIMULACIÓN DE CORREO]\nPara: {user_email}\nLink: {verification_link}\n{'='*60}\n")

    sender_email = os.environ.get('SMTP_USER')
    sender_password = os.environ.get('SMTP_PASS')
    if sender_email and sender_password:
        try:
            msg = MIMEMultipart()
            msg['From'] = 'PetStore <no-reply@petstore.local>'
            msg['To'] = user_email
            msg['Subject'] = 'Verifica tu cuenta en PetStore'
            body = f"Hola,\n\nVerifica tu cuenta haciendo click aquí:\n{verification_link}\n\nSi no fuiste tú, ignora este correo."
            msg.attach(MIMEText(body, 'plain'))
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, user_email, msg.as_string())
            server.quit()
        except Exception as e:
            print(f"Error SMTP: {e}")


# ════════════════════════════════════════════════════════════
#  ENDPOINTS DE NEGOCIO
# ════════════════════════════════════════════════════════════

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Datos inválidos.'}), 400

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email', '')
    telefono = data.get('telefono', '')
    password = data.get('password')
    ip = get_client_ip()

    if not all([nombre, apellido, email, telefono, password]):
        return jsonify({'success': False, 'message': 'Todos los campos son obligatorios.'}), 400

    # 1. Validar email
    ok_email, msg_email, email_norm = validate_email_full(email, ip)
    if not ok_email:
        return jsonify({'success': False, 'message': msg_email}), 400

    # 2. Validar teléfono
    ok_phone, phone_norm = validate_phone_full(telefono, ip)
    if not ok_phone:
        return jsonify({'success': False, 'message': phone_norm}), 400

    # 3. Guardar usuario
    hashed_password = generate_password_hash(password)
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute(
            'INSERT INTO users (nombre, apellido, email, telefono, password, is_verified) '
            'VALUES (?, ?, ?, ?, ?, 0)',
            (nombre, apellido, email_norm, phone_norm, hashed_password)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        log_attempt(email_norm, ip, 'email', 'duplicate', 'Correo ya registrado')
        return jsonify({'success': False, 'message': 'Ese correo ya está registrado.'}), 409
    finally:
        conn.close()

    log_attempt(email_norm, ip, 'email', 'success', 'Email validado correctamente')
    log_attempt(phone_norm, ip, 'phone', 'success', 'Teléfono validado correctamente')

    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    token = serializer.dumps(email_norm, salt='email-verification')
    threading.Thread(target=send_verification_email, args=(email_norm, token)).start()

    return jsonify({'success': True, 'message': '¡Cuenta creada! Revisa tu correo para verificarla antes de iniciar sesión.'}), 201


@app.route('/api/auth/verify/<token>', methods=['GET'])
def verify_email(token):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt='email-verification', max_age=3600)
    except SignatureExpired:
        return "<h1>Error: enlace expirado.</h1>", 400
    except BadTimeSignature:
        return "<h1>Error: enlace inválido.</h1>", 400

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("UPDATE users SET is_verified = 1 WHERE email = ?", (email,))
    conn.commit()
    conn.close()

    return f"""
    <html><head><meta charset="UTF-8"><title>Cuenta Verificada</title></head>
    <body style="font-family:Arial;text-align:center;padding:50px;background:#0f172a;color:#f8fafc;">
        <div style="background:#1e293b;max-width:500px;margin:auto;padding:30px;border-radius:12px;">
            <h1 style="color:#4ade80;">¡Cuenta Verificada!</h1>
            <p style="color:#94a3b8;">Tu cuenta ha sido verificada correctamente.</p>
            <a href="{FRONTEND_URL}/login" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">Iniciar Sesión</a>
        </div>
    </body></html>
    """


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Faltan credenciales.'}), 400

    email = data.get('email')
    password = data.get('password')

    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        if not user['is_verified']:
            return jsonify({'success': False, 'message': 'Debes verificar tu correo antes de iniciar sesión.'}), 403

        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'success': True,
            'message': f'¡Bienvenido de nuevo, {user["nombre"]}!',
            'token': token,
            'user': {
                'id': user['id'], 'nombre': user['nombre'], 'apellido': user['apellido'],
                'email': user['email'], 'telefono': user['telefono']
            }
        }), 200

    return jsonify({'success': False, 'message': 'Correo o contraseña incorrectos.'}), 401


# ════════════════════════════════════════════════════════════
#  ENDPOINTS DE ADMINISTRACIÓN (panel)
# ════════════════════════════════════════════════════════════

@app.route('/api/auth/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    username = data.get('username', '')
    password = data.get('password', '')
    admin_user = os.environ.get('ADMIN_USER', 'admin')
    admin_pass = os.environ.get('ADMIN_PASS', 'admin1234')

    if username != admin_user or password != admin_pass:
        return jsonify({'success': False, 'message': 'Credenciales incorrectas.'}), 401

    token = jwt.encode({
        'role': 'admin',
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'success': True, 'token': token}), 200


def require_admin():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return False
    try:
        payload = jwt.decode(auth.split(' ', 1)[1], app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('role') == 'admin'
    except jwt.InvalidTokenError:
        return False


@app.route('/api/auth/admin-verify', methods=['GET'])
def admin_verify():
    return jsonify({'valid': require_admin()}), (200 if require_admin() else 401)


# ════════════════════════════════════════════════════════════
#  ENDPOINTS DEL DASHBOARD
# ════════════════════════════════════════════════════════════

@app.route('/api/auth/logs', methods=['GET'])
def get_logs():
    limit = request.args.get('limit', 200, type=int)
    vtype = request.args.get('type')  # 'email', 'phone' o None
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    if vtype in ('email', 'phone'):
        c.execute("SELECT * FROM validation_logs WHERE validation_type = ? ORDER BY id DESC LIMIT ?",
                  (vtype, limit))
    else:
        c.execute("SELECT * FROM validation_logs ORDER BY id DESC LIMIT ?", (limit,))
    logs = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(logs)


@app.route('/api/auth/stats', methods=['GET'])
def get_stats():
    vtype = request.args.get('type')
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()

    if vtype in ('email', 'phone'):
        c.execute("SELECT COUNT(*) FROM validation_logs WHERE validation_type = ?", (vtype,))
        total = c.fetchone()[0]
        c.execute("SELECT result, COUNT(*) FROM validation_logs WHERE validation_type = ? GROUP BY result", (vtype,))
    else:
        c.execute("SELECT COUNT(*) FROM validation_logs")
        total = c.fetchone()[0]
        c.execute("SELECT result, COUNT(*) FROM validation_logs GROUP BY result")
    by_result = {row[0]: row[1] for row in c.fetchall()}
    conn.close()

    success = by_result.get('success', 0)
    blocked = sum(v for k, v in by_result.items() if k.startswith('blocked'))
    duplicates = by_result.get('duplicate', 0)
    success_rate = round((success / total * 100), 1) if total > 0 else 0

    return jsonify({
        'total': total,
        'success': success,
        'blocked': blocked,
        'duplicates': duplicates,
        'success_rate': success_rate,
        'by_result': by_result,
        'service': 'auth-service-full',
        'type': vtype or 'all'
    })


# ════════════════════════════════════════════════════════════
#  ENDPOINTS DE BLOCKLIST (CRUD para inteligencia colectiva)
# ════════════════════════════════════════════════════════════

@app.route('/api/auth/blocklist', methods=['GET'])
def get_blocklist():
    if not require_admin():
        return jsonify({'message': 'No autorizado'}), 401
    return jsonify(sorted(get_custom_blocklist()))


@app.route('/api/auth/blocklist', methods=['POST'])
def add_blocklist():
    if not require_admin():
        return jsonify({'message': 'No autorizado'}), 401
    data = request.get_json() or {}
    domain = data.get('domain', '').strip().lower()
    if not domain or '.' not in domain:
        return jsonify({'success': False, 'message': 'Dominio inválido'}), 400
    added = add_to_custom_blocklist(domain)
    return jsonify({
        'success': True,
        'added': added,
        'message': f'Dominio "{domain}" añadido' if added else f'"{domain}" ya estaba en la lista'
    })


@app.route('/api/auth/blocklist/<domain>', methods=['DELETE'])
def delete_blocklist(domain):
    if not require_admin():
        return jsonify({'message': 'No autorizado'}), 401
    removed = remove_from_custom_blocklist(domain)
    return jsonify({
        'success': True,
        'removed': removed,
        'message': f'Dominio "{domain}" eliminado' if removed else f'"{domain}" no estaba en la lista'
    })


@app.route('/api/auth/global-blocklist', methods=['GET'])
def global_blocklist():
    """
    Endpoint público para INTELIGENCIA COLECTIVA.
    Microservicios cliente desplegados con Ansible consultan este endpoint
    periódicamente para sincronizar su lista negra con el servidor central.
    """
    return jsonify({
        'blocklist': sorted(get_custom_blocklist()),
        'updated_at': datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
        'source': 'central-auth-service'
    })


# ════════════════════════════════════════════════════════════
#  HEALTH CHECK
# ════════════════════════════════════════════════════════════

@app.route('/api/auth/health', methods=['GET'])
def health():
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.execute('SELECT 1')
        conn.close()
        db_ok = True
    except Exception:
        db_ok = False

    return jsonify({
        'status': 'healthy' if db_ok else 'degraded',
        'service': 'auth-service-full',
        'database': db_ok,
        'cache_entries': len(_cache),
        'blocklist_entries': len(get_custom_blocklist()),
        'timestamp': datetime.datetime.utcnow().isoformat()
    }), 200 if db_ok else 503


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
