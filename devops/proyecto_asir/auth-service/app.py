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
# Enable CORS so the React frontend can talk to this service
CORS(app)

# We would normally keep this secret in an environment variable
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'petstore_super_secret_key_123')
DB_FILE = 'users.db'
CUSTOM_BLOCKLIST_FILE = 'custom_blocklist.txt'

# URLs configurables para despliegue (en local usan localhost por defecto)
API_URL = os.environ.get('API_URL', 'http://localhost:5000')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

def get_custom_blocklist():
    if not os.path.exists(CUSTOM_BLOCKLIST_FILE):
        return set()
    with open(CUSTOM_BLOCKLIST_FILE, 'r', encoding='utf-8') as f:
        return set(line.strip().lower() for line in f if line.strip() and not line.startswith('#'))

def init_db():
    """Initializes the SQLite database from scratch if it doesn't exist."""
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
    # If the database already exists, attempt to add the is_verified column
    try:
        c.execute("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0")
    except sqlite3.OperationalError:
        # Expected error if the column already exists
        pass
    conn.commit()
    conn.close()

# Initialize the db on startup
init_db()


def send_verification_email(user_email, token):
    """
    Envía un correo con el link o lo imprime en consola si no hay credenciales SMTP.
    """
    verification_link = f"{API_URL}/api/auth/verify/{token}"
    
    # 1. Simulación en Consola (Muy útil para ver el flujo en local sin configurar cuentas)
    print(f"\n{'='*60}\n[SIMULACIÓN DE ENVÍO DE CORREO]\nPara: {user_email}\nAsunto: Verifica tu cuenta en PetStore\n\nPor favor, verifica tu cuenta haciendo click en el siguiente enlace:\n{verification_link}\n{'='*60}\n")
    
    # 2. Envío de Correo Real (Requiere configurar SMTP_USER y SMTP_PASS en el sistema operativo)
    sender_email = os.environ.get('SMTP_USER')
    sender_password = os.environ.get('SMTP_PASS')
    
    if sender_email and sender_password:
        try:
            msg = MIMEMultipart()
            msg['From'] = 'PetStore <no-reply@petstore.local>'
            msg['To'] = user_email
            msg['Subject'] = 'Verifica tu cuenta en PetStore'
            
            body = f"Hola,\n\nGracias por registrarte en PetStore. Por favor, verifica tu cuenta haciendo click en este enlace:\n{verification_link}\n\nSi no fuiste tú, puedes ignorar este correo."
            msg.attach(MIMEText(body, 'plain'))
            
            # Usando el servidor de Gmail como ejemplo por defecto
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, user_email, msg.as_string())
            server.quit()
        except Exception as e:
            print(f"Error enviando correo real por SMTP: {str(e)}")


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Datos inválidos.'}), 400

    nombre = data.get('nombre')
    apellido = data.get('apellido')
    email = data.get('email')
    telefono = data.get('telefono')
    password = data.get('password')

    if not all([nombre, apellido, email, telefono, password]):
        return jsonify({'success': False, 'message': 'Todos los campos son obligatorios.'}), 400

    # 1. VALIDATE EMAIL DOMAIN (MX RECORDS & FORMAT AND TEMPORAL LISTS)
    try:
        # validate_email performs format check and MX record check (deliverability)
        valid = validate_email(email, check_deliverability=True)
        email = valid.normalized
        
        # Get domain part in lowercase
        parts = email.split('@')
        domain = parts[1].lower() if len(parts) > 1 else ""
        
        # Robust check against local pip blocklist (fast fail)
        is_disposable = False
        domain_parts = domain.split('.')
        for i in range(len(domain_parts) - 1):
            check_domain = ".".join(domain_parts[i:])
            if check_domain in blocklist:
                is_disposable = True
                break
                
        # API Check against Debounce (Catch dynamic temp emails)
        if not is_disposable:
            try:
                debounce_resp = requests.get(
                    f'https://disposable.debounce.io/?email={email}', 
                    headers={'User-Agent': 'Mozilla/5.0'},
                    timeout=5
                )
                if debounce_resp.status_code == 200:
                    data = debounce_resp.json()
                    if data.get('disposable') == 'true':
                        is_disposable = True
            except requests.RequestException:
                pass # Silently proceed if API is down to avoid blocking legit users
        
        if is_disposable:
            return jsonify({'success': False, 'message': 'No se permiten proveedores de correo temporal o desechable.'}), 400
            
    except EmailNotValidError as e:
        return jsonify({'success': False, 'message': f"Email inválido: {str(e)}"}), 400

    # 2. HASH PASSWORD
    hashed_password = generate_password_hash(password)

    # 3. SAVE TO DB (WITH VERIFIED=0)
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('''
            INSERT INTO users (nombre, apellido, email, telefono, password, is_verified) 
            VALUES (?, ?, ?, ?, ?, 0)
        ''', (nombre, apellido, email, telefono, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Ese correo ya está registrado.'}), 409
    finally:
        conn.close()

    # 4. GENERATE VERIFICATION TOKEN
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    token = serializer.dumps(email, salt='email-verification')
    
    # 5. SEND EMAIL IN BACKGROUND THREAD
    threading.Thread(target=send_verification_email, args=(email, token)).start()

    return jsonify({'success': True, 'message': '¡Cuenta creada! Por favor, revisa tu correo electrónico para verificar tu cuenta antes de iniciar sesión.'}), 201


@app.route('/api/auth/verify/<token>', methods=['GET'])
def verify_email(token):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        # El token tiene validez de máximo 1 hora (3600 segundos)
        email = serializer.loads(token, salt='email-verification', max_age=3600)
    except SignatureExpired:
        return "<h1>Error: El enlace de verificación ha expirado. Deberás volver a registrarte.</h1>", 400
    except BadTimeSignature:
        return "<h1>Error: Enlace de verificación inválido o corrupto.</h1>", 400
        
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("UPDATE users SET is_verified = 1 WHERE email = ?", (email,))
    conn.commit()
    conn.close()
    
    # Una vista simple que te redirige amablemente al Frontend local
    return f"""
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Cuenta Verificada</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f7f7f7;">
            <div style="background: white; max-width: 500px; margin: auto; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h1 style="color: #4CAF50; font-size: 24px;">¡Felicidades!</h1>
                <p style="font-size: 16px; color: #555;">Tu cuenta de PetStore ha sido verificada correctamente.</p>
                <div style="margin-top: 30px;">
                    <a href="{FRONTEND_URL}/login" style="display: inline-block; padding: 12px 24px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Ir a Iniciar Sesión
                    </a>
                </div>
            </div>
        </body>
    </html>
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
        
        # Bloqueo: si la cuenta no fue verificada, no entra.
        if not user['is_verified']:
            return jsonify({'success': False, 'message': 'Debes verificar tu correo electrónico antes de poder iniciar sesión. Revisa tu bandeja de entrada o ejecuta la consola de Auth.'}), 403

        # Generar Token JWT
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
    # Run service
    app.run(host='0.0.0.0', port=5000, debug=True)
