"""
Auth Service - Lista Cerrada (cliente)
======================================

Microservicio CLIENTE de la inteligencia colectiva:
- Valida correos contra una lista cerrada de dominios permitidos
- Valida teléfonos con phonenumbers
- Sincroniza periódicamente la blocklist global desde el servidor central
- Envía sus logs al servidor central
"""
import os
import sqlite3
import jwt
import datetime
import threading
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import phonenumbers
from phonenumbers import NumberParseException
import requests

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'petstore_super_secret_key_123')

os.makedirs('data', exist_ok=True)
DB_FILE = 'data/users_lista_cerrada.db'
GLOBAL_BLOCKLIST_FILE = 'data/global_blocklist.txt'

CENTRAL_URL = os.environ.get('CENTRAL_URL', 'http://auth-service:5000')
SYNC_INTERVAL = int(os.environ.get('SYNC_INTERVAL', '300'))  # 5 min

ALLOWED_DOMAINS = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
    'yahoo.es', 'icloud.com', 'aol.com', 'zoho.com',
    'protonmail.com', 'gmx.com', 'yandex.com'
]


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
    except Exception:
        pass


def get_global_blocklist():
    if not os.path.exists(GLOBAL_BLOCKLIST_FILE):
        return set()
    with open(GLOBAL_BLOCKLIST_FILE, 'r', encoding='utf-8') as f:
        return set(line.strip().lower() for line in f if line.strip())


# ════════════════════════════════════════════════════════════
#  SINCRONIZACIÓN — Inteligencia Colectiva
# ════════════════════════════════════════════════════════════

def sync_global_blocklist():
    """Descarga la blocklist global desde el servidor central."""
    try:
        resp = requests.get(f'{CENTRAL_URL}/api/auth/global-blocklist', timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            blocklist = data.get('blocklist', [])
            with open(GLOBAL_BLOCKLIST_FILE, 'w', encoding='utf-8') as f:
                f.write('\n'.join(blocklist) + '\n')
            print(f"[SYNC] Blocklist global sincronizada: {len(blocklist)} dominios")
            return True
    except Exception as e:
        print(f"[SYNC] Error sincronizando con {CENTRAL_URL}: {e}")
    return False


def sync_loop():
    """Bucle en hilo de fondo que sincroniza la blocklist cada SYNC_INTERVAL."""
    time.sleep(10)  # Esperar a que el servidor central esté disponible
    while True:
        sync_global_blocklist()
        time.sleep(SYNC_INTERVAL)


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

# Lanzar hilo de sincronización
threading.Thread(target=sync_loop, daemon=True).start()


# ════════════════════════════════════════════════════════════
#  VALIDACIONES
# ════════════════════════════════════════════════════════════

def validate_phone(telefono, ip, default_region='ES'):
    try:
        parsed = phonenumbers.parse(telefono, default_region)
    except NumberParseException as e:
        log_attempt(telefono, ip, 'phone', 'blocked_format', str(e))
        return False, f'Número de teléfono inválido: {str(e)}'

    if not phonenumbers.is_possible_number(parsed) or not phonenumbers.is_valid_number(parsed):
        log_attempt(telefono, ip, 'phone', 'blocked_format', 'Número no válido')
        return False, 'El número de teléfono no es válido.'

    line_type = phonenumbers.number_type(parsed)
    blocked_types = {
        phonenumbers.PhoneNumberType.PREMIUM_RATE,
        phonenumbers.PhoneNumberType.SHARED_COST,
        phonenumbers.PhoneNumberType.UAN,
        phonenumbers.PhoneNumberType.VOICEMAIL,
    }
    if line_type in blocked_types:
        log_attempt(telefono, ip, 'phone', 'blocked_premium', f'Tipo bloqueado: {line_type}')
        return False, 'Tipo de número no permitido.'

    return True, phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)


# ════════════════════════════════════════════════════════════
#  ENDPOINTS
# ════════════════════════════════════════════════════════════

@app.route('/api/auth/register', methods=['POST'])
def register():
    request_data = request.get_json()
    if not request_data:
        return jsonify({'success': False, 'message': 'Datos inválidos.'}), 400

    nombre = request_data.get('nombre')
    apellido = request_data.get('apellido')
    email = request_data.get('email', '').strip().lower()
    telefono = request_data.get('telefono', '')
    password = request_data.get('password')
    ip = get_client_ip()

    if not all([nombre, apellido, email, telefono, password]):
        return jsonify({'success': False, 'message': 'Todos los campos son obligatorios.'}), 400

    # 1. FORMATO BÁSICO
    if '@' not in email:
        msg = 'Formato de correo inválido.'
        log_attempt(email, ip, 'email', 'blocked_format', msg)
        return jsonify({'success': False, 'message': msg}), 400

    # 2. LISTA CERRADA DE DOMINIOS
    domain = email.split('@')[-1]
    if domain not in ALLOWED_DOMAINS:
        msg = f"Dominio no permitido. Solo admitimos: {', '.join(ALLOWED_DOMAINS)}"
        log_attempt(email, ip, 'email', 'blocked_domain', msg)
        return jsonify({'success': False, 'message': msg}), 400

    # 3. BLOCKLIST GLOBAL (inteligencia colectiva)
    global_bl = get_global_blocklist()
    if domain in global_bl:
        msg = f'El dominio "{domain}" está bloqueado por la inteligencia colectiva.'
        log_attempt(email, ip, 'email', 'blocked_global', msg)
        return jsonify({'success': False, 'message': msg}), 400

    # 4. VALIDAR TELÉFONO
    ok_phone, phone_norm = validate_phone(telefono, ip)
    if not ok_phone:
        return jsonify({'success': False, 'message': phone_norm}), 400

    # 5. GUARDAR
    hashed_password = generate_password_hash(password)
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute(
            'INSERT INTO users (nombre, apellido, email, telefono, password, is_verified) '
            'VALUES (?, ?, ?, ?, ?, 1)',
            (nombre, apellido, email, phone_norm, hashed_password)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        msg = 'Ese correo ya está registrado.'
        log_attempt(email, ip, 'email', 'duplicate', msg)
        return jsonify({'success': False, 'message': msg}), 409
    finally:
        conn.close()

    log_attempt(email, ip, 'email', 'success', 'Email validado (lista cerrada)')
    log_attempt(phone_norm, ip, 'phone', 'success', 'Teléfono validado')
    return jsonify({'success': True, 'message': '¡Cuenta creada con éxito! Al ser una demo, tu cuenta ya está validada automáticamente.'}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    request_data = request.get_json()
    if not request_data:
        return jsonify({'success': False, 'message': 'Faltan credenciales.'}), 400

    email = request_data.get('email')
    password = request_data.get('password')

    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = c.fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        if not user['is_verified']:
            return jsonify({'success': False, 'message': 'Debes verificar tu correo electrónico.'}), 403

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


@app.route('/api/auth/logs', methods=['GET'])
def get_logs():
    limit = request.args.get('limit', 200, type=int)
    vtype = request.args.get('type')
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
        'service': 'auth-service-lista-cerrada',
        'type': vtype or 'all',
        'global_blocklist_count': len(get_global_blocklist())
    })


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
        'service': 'auth-service-lista-cerrada',
        'database': db_ok,
        'global_blocklist_count': len(get_global_blocklist()),
        'central_url': CENTRAL_URL,
        'timestamp': datetime.datetime.utcnow().isoformat()
    }), 200 if db_ok else 503


@app.route('/api/auth/sync', methods=['POST'])
def force_sync():
    """Permite forzar la sincronización con el servidor central manualmente."""
    ok = sync_global_blocklist()
    return jsonify({
        'success': ok,
        'blocklist_count': len(get_global_blocklist())
    })


if __name__ == '__main__':
    print(f"Iniciando MICROSERVICIO LISTA CERRADA en el puerto 5003... (sync con {CENTRAL_URL})")
    app.run(host='0.0.0.0', port=5003, debug=True)
