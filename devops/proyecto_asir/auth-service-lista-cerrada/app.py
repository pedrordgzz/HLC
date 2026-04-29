import os
import sqlite3
import jwt
import datetime
import threading
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'petstore_super_secret_key_123')

os.makedirs('data', exist_ok=True)
DB_FILE = 'data/users_lista_cerrada.db'

ALLOWED_DOMAINS = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
    'yahoo.es', 'icloud.com', 'aol.com', 'zoho.com',
    'protonmail.com', 'gmx.com', 'yandex.com'
]


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


@app.route('/api/auth/register', methods=['POST'])
def register():
    request_data = request.get_json()
    if not request_data:
        return jsonify({'success': False, 'message': 'Datos inválidos.'}), 400

    nombre = request_data.get('nombre')
    apellido = request_data.get('apellido')
    email = request_data.get('email', '').strip()
    telefono = request_data.get('telefono')
    password = request_data.get('password')
    ip = get_client_ip()

    if not all([nombre, apellido, email, telefono, password]):
        return jsonify({'success': False, 'message': 'Todos los campos son obligatorios.'}), 400

    # 1. VALIDAR FORMATO BÁSICO
    if '@' not in email:
        msg = 'Formato de correo inválido.'
        log_attempt(email, ip, 'blocked_format', msg)
        return jsonify({'success': False, 'message': msg}), 400

    # 2. VALIDAR DOMINIO CONTRA LISTA CERRADA
    domain = email.split('@')[-1].lower()
    if domain not in ALLOWED_DOMAINS:
        msg = f"Dominio no permitido. Solo admitimos: {', '.join(ALLOWED_DOMAINS)}"
        log_attempt(email, ip, 'blocked_domain', msg)
        return jsonify({'success': False, 'message': msg}), 400

    # 3. GUARDAR EN BD
    hashed_password = generate_password_hash(password)
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute(
            'INSERT INTO users (nombre, apellido, email, telefono, password, is_verified) VALUES (?, ?, ?, ?, ?, 1)',
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

    msg = 'Cuenta creada con éxito (demo - verificación automática).'
    log_attempt(email, ip, 'success', msg)
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
        by_result.get('blocked_domain', 0) +
        by_result.get('blocked_format', 0)
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
        'service': 'auth-service-lista-cerrada'
    })


if __name__ == '__main__':
    print("Iniciando MICROSERVICIO LISTA CERRADA en el puerto 5003...")
    app.run(host='0.0.0.0', port=5003, debug=True)
