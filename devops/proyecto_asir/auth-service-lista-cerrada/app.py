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
# Enable CORS so the React frontend can talk to this service
CORS(app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'petstore_super_secret_key_123')
DB_FILE = 'users_lista_cerrada.db'

ALLOWED_DOMAINS = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 
    'yahoo.es', 'icloud.com', 'aol.com', 'zoho.com', 
    'protonmail.com', 'gmx.com', 'yandex.com'
]

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
    conn.commit()
    conn.close()

init_db()

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Datos inválidos.'}), 400

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email', '').strip()
    telefono = data.get('telefono')
    password = data.get('password')

    if not all([nombre, apellido, email, telefono, password]):
        return jsonify({'success': False, 'message': 'Todos los campos son obligatorios.'}), 400

    # 1. VALIDATE EMAIL DOMAIN (LISTA CERRADA)
    if '@' not in email:
        return jsonify({'success': False, 'message': 'Formato de correo inválido.'}), 400
    
    domain = email.split('@')[-1].lower()
    if domain not in ALLOWED_DOMAINS:
        return jsonify({'success': False, 'message': f"Dominio no permitido. Solo admitimos: {', '.join(ALLOWED_DOMAINS)}"}), 400

    # 2. HASH PASSWORD
    hashed_password = generate_password_hash(password)

    # 3. SAVE TO DB (Simulando que ya están verificados para no complicar la demo)
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('''
            INSERT INTO users (nombre, apellido, email, telefono, password, is_verified) 
            VALUES (?, ?, ?, ?, ?, 1)
        ''', (nombre, apellido, email, telefono, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Ese correo ya está registrado.'}), 409
    finally:
        conn.close()

    return jsonify({'success': True, 'message': '¡Cuenta creada con éxito! Al ser una demo, tu cuenta ya está validada automáticamente.'}), 201

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
        
        return jsonify({
            'success': True, 
            'message': f'¡Bienvenido de nuevo, {user["nombre"]}!',
            'token': token,
            'user': user_data
        }), 200

    return jsonify({'success': False, 'message': 'Correo o contraseña incorrectos.'}), 401

if __name__ == '__main__':
    print("Iniciando MICROSERVICIO LISTA CERRADA en el puerto 5003...")
    app.run(host='0.0.0.0', port=5003, debug=True)
