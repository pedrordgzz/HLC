import os
from flask import Flask, render_template, request

app = Flask(__name__)

# Lista de los dominios más conocidos internacionalmente
ALLOWED_DOMAINS = [
    'gmail.com', 
    'hotmail.com', 
    'outlook.com', 
    'yahoo.com', 
    'yahoo.es',    
    'icloud.com', 
    'aol.com', 
    'zoho.com', 
    'protonmail.com', 
    'gmx.com', 
    'yandex.com'
]

@app.route('/', methods=['GET', 'POST'])
def register():
    message = None
    message_type = None
    
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        
        # Validar si tiene formato de email muy básico (contiene @)
        if not email or '@' not in email:
            message = "Error: El formato del correo es inválido. Debe contener una '@'."
            message_type = "danger"
        else:
            # Extraer el dominio
            domain = email.split('@')[-1]
            
            # Comprobar contra la lista cerrada
            if domain not in ALLOWED_DOMAINS:
                message = f"Error: El dominio '{domain}' no está en la lista de dominios permitidos."
                message_type = "danger"
            else:
                message = f"¡Simulación de Éxito! El correo '{email}' ha superado la validación de la lista cerrada."
                message_type = "success"
        
    return render_template('register.html', 
                           allowed_domains=ALLOWED_DOMAINS, 
                           message=message, 
                           message_type=message_type)

if __name__ == '__main__':
    print("Iniciando web LISTA CERRADA en el puerto 5002...")
    app.run(host='0.0.0.0', port=5002, debug=True)
