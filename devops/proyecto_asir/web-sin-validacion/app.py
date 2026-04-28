import os
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def register():
    message = None
    message_type = None
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        # No se hace ninguna validación extra más que recibir el texto
        message = f"¡Simulación de Éxito! El correo '{email}' ha sido registrado y aceptado."
        message_type = "success"
        
    return render_template('register.html', message=message, message_type=message_type)

if __name__ == '__main__':
    print("Iniciando web SIN VALIDACIÓN en el puerto 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)
