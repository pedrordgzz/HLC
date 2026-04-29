import os
import sqlite3
import jwt
import datetime
import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError
import requests
from disposable_email_domains import blocklist
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'petstore_super_secret_key_123')

os.makedirs('data', exist_ok=True)
DB_FILE = 'data/users.db'
CUSTOM_BLOCKLIST_FILE = 'custom_blocklist.txt'

API_URL = os.environ.get('API_URL', 'http://localhost:5000')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')


def get_custom_blocklist():
    if not os.path.exists(CUSTOM_BLOCKLIST_FILE):
        return set()
    with open(CUSTOM_BLOCKLIST_FILE, 'r', encoding='utf-8') as f:
        return set(line.strip().lower() for line in f if line.strip() and not line.startswith('#'))


def get_client_ip():
    return request.headers.get('X-Real-IP', request.remote_addr)


def log_attempt(email, ip, result, message):
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute(
            'INSERT INTO validation_logs (timestamp, email, ip, result, message) VALUES (?, ?, ?, ?, ?)',
            (datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'), email, ip, result, message)
        )
        conn.commit()
        conn.close()
    except Exception:
        pass


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
    try:
        c.execute("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        pass
    c.execute('''
        CREATE TABLE IF NOT EXISTS validation_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            email TEXT NOT NULL,
            ip TEXT,
            result TEXT NOT NULL,
            message TEXT
        )
    ''')
    conn.commit()
    conn.close()


init_db()


def send_verification_email(user_email, token):
    verification_link = f"{API_URL}/api/auth/verify/{token}"
    print(f"\n{'='*60}\n[SIMULACIÓN DE ENVÍO DE CORREO]\nPara: {user_email}\nLink: {verification_link}\n{'='*60}\n")

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
            print(f"Error enviando correo: {str(e)}")


@app.route('/api/auth/register', methods=['POST'])
def register():
    request_data = request.get_json()
    if not request_data:
        return jsonify({'success': False, 'message': 'Datos inválidos.'}), 400

    nombre = request_data.get('nombre')
    apellido = request_data.get('apellido')
    email = request_data.get('email', '')
    telefono = request_data.get('telefono')
    password = request_data.get('password')
    ip = get_client_ip()

    if not all([nombre, apellido, email, telefono, password]):
        return jsonify({'success': False, 'message': 'Todos los campos son obligatorios.'}), 400

    # 1. VALIDAR FORMATO Y REGISTROS MX
    try:
        valid = validate_email(email, check_deliverability=True)
        email = valid.normalized

        parts = email.split('@')
        domain = parts[1].lower() if len(parts) > 1 else ""

        # 2. COMPROBAR LISTA NEGRA LOCAL (pip: disposable-email-domains)
        is_disposable = False
        domain_parts = domain.split('.')
        for i in range(len(domain_parts) - 1):
            check_domain = ".".join(domain_parts[i:])
            if check_domain in blocklist:
                is_disposable = True
                break

        # 3. COMPROBAR API DEBOUNCE (correos temporales dinámicos)
        if not is_disposable:
            try:
                debounce_resp = requests.get(
                    f'https://disposable.debounce.io/?email={email}',
                    headers={'User-Agent': 'Mozilla/5.0'},
                    timeout=5
                )
                if debounce_resp.status_code == 200:
                    debounce_data = debounce_resp.json()
                    if debounce_data.get('disposable') == 'true':
                        is_disposable = True
            except requests.RequestException:
                pass

        if is_disposable:
            msg = 'No se permiten proveedores de correo temporal o desechable.'
            log_attempt(email, ip, 'blocked_disposable', msg)
            return jsonify({'success': False, 'message': msg}), 400

    except EmailNotValidError as e:
        msg = f"Email inválido: {str(e)}"
        log_attempt(email, ip, 'blocked_format', msg)
        return jsonify({'success': False, 'message': msg}), 400

    # 4. GUARDAR EN BD
    hashed_password = generate_password_hash(password)
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute(
            'INSERT INTO users (nombre, apellido, email, telefono, password, is_verified) VALUES (?, ?, ?, ?, ?, 0)',
            (nombre, apellido, email, telefono, hashed_password)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        msg = 'Ese correo ya está registrado.'
        log_attempt(email, ip, 'duplicate', msg)
        return jsonify({'success': False, 'message': msg}), 409
    finally:
        conn.close()

    # 5. TOKEN DE VERIFICACIÓN Y EMAIL
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    token = serializer.dumps(email, salt='email-verification')
    threading.Thread(target=send_verification_email, args=(email, token)).start()

    msg = '¡Cuenta creada! Revisa tu correo para verificar tu cuenta.'
    log_attempt(email, ip, 'success', msg)
    return jsonify({'success': True, 'message': '¡Cuenta creada! Por favor, revisa tu correo electrónico para verificar tu cuenta antes de iniciar sesión.'}), 201


@app.route('/api/auth/verify/<token>', methods=['GET'])
def verify_email(token):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt='email-verification', max_age=3600)
    except SignatureExpired:
        return "<h1>Error: El enlace de verificación ha expirado.</h1>", 400
    except BadTimeSignature:
        return "<h1>Error: Enlace de verificación inválido.</h1>", 400

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("UPDATE users SET is_verified = 1 WHERE email = ?", (email,))
    conn.commit()
    conn.close()

    return f"""
    <html>
        <head><meta charset="UTF-8"><title>Cuenta Verificada</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #0f172a; color: #f8fafc;">
            <div style="background: #1e293b; max-width: 500px; margin: auto; padding: 30px; border-radius: 12px;">
                <h1 style="color: #4ade80;">¡Cuenta Verificada!</h1>
                <p style="color: #94a3b8;">Tu cuenta de PetStore ha sido verificada correctamente.</p>
                <a href="{FRONTEND_URL}/login" style="display:inline-block; margin-top:20px; padding:12px 24px; background:#f97316; color:white; border-radius:8px; text-decoration:none; font-weight:bold;">
                    Ir a Iniciar Sesión
                </a>
            </div>
        </body>
    </html>
    """


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
            return jsonify({'success': False, 'message': 'Debes verificar tu correo electrónico antes de iniciar sesión.'}), 403

        token_expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        token_payload = {
            'user_id': user['id'],
            'email': user['email'],
            'exp': token_expiration
        }
        token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm='HS256')

        user_data = {
            'id': user['id'],
            'nombre': user['nombre'],
            'apellido': user['apellido'],
            'email': user['email'],
            'telefono': user['telefono']
        }
        return jsonify({'success': True, 'message': f'¡Bienvenido de nuevo, {user["nombre"]}!', 'token': token, 'user': user_data}), 200

    return jsonify({'success': False, 'message': 'Correo o contraseña incorrectos.'}), 401


@app.route('/api/auth/admin-login', methods=['POST'])
def admin_login():
    request_data = request.get_json()
    if not request_data:
        return jsonify({'success': False, 'message': 'Datos inválidos.'}), 400

    username = request_data.get('username', '')
    password = request_data.get('password', '')

    admin_user = os.environ.get('ADMIN_USER', 'admin')
    admin_pass = os.environ.get('ADMIN_PASS', 'admin1234')

    if username != admin_user or password != admin_pass:
        return jsonify({'success': False, 'message': 'Credenciales incorrectas.'}), 401

    token_payload = {
        'role': 'admin',
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    }
    token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'success': True, 'token': token}), 200


@app.route('/api/auth/admin-verify', methods=['GET'])
def admin_verify():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return jsonify({'valid': False}), 401
    token = auth_header.split(' ', 1)[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        if payload.get('role') != 'admin':
            return jsonify({'valid': False}), 403
        return jsonify({'valid': True}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'valid': False, 'message': 'Sesión expirada.'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'valid': False, 'message': 'Token inválido.'}), 401


@app.route('/api/auth/logs', methods=['GET'])
def get_logs():
    limit = request.args.get('limit', 200, type=int)
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM validation_logs ORDER BY id DESC LIMIT ?", (limit,))
    logs = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(logs)


@app.route('/api/auth/stats', methods=['GET'])
def get_stats():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM validation_logs")
    total = c.fetchone()[0]
    c.execute("SELECT result, COUNT(*) FROM validation_logs GROUP BY result")
    by_result = {row[0]: row[1] for row in c.fetchall()}
    conn.close()

    success = by_result.get('success', 0)
    blocked = (
        by_result.get('blocked_disposable', 0) +
        by_result.get('blocked_format', 0) +
        by_result.get('blocked_mx', 0)
    )
    duplicates = by_result.get('duplicate', 0)
    success_rate = round((success / total * 100), 1) if total > 0 else 0

    return jsonify({
        'total': total,
        'success': success,
        'blocked': blocked,
        'duplicates': duplicates,
        'success_rate': success_rate,
        'by_result': by_result,
        'service': 'auth-service-full'
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
