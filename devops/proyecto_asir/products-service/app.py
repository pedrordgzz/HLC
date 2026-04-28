import os
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Permitir peticiones desde el frontend
CORS(app)

DB_FILE = 'data/products.db'
os.makedirs('data', exist_ok=True)

# Datos semilla
PRODUCTS_DATA = [
  {
    'id': 1,
    'category': 'comida',
    'tag': 'Perros',
    'title': 'Croquetas High Protein',
    'description': 'Fórmula rica en salmón y arroz, ideal para el pelaje y la energía digestiva de perros adultos.',
    'price': '45.99',
    'unit': '/ 10kg'
  },
  {
    'id': 2,
    'category': 'comida',
    'tag': 'Gatos',
    'title': 'Mix Pescado Azul',
    'description': 'Receta exclusiva para gatos esterilizados. Control de peso con todo el sabor del océano.',
    'price': '29.50',
    'unit': '/ 5kg'
  },
  {
    'id': 3,
    'category': 'comida',
    'tag': 'Cachorros',
    'title': 'Starter Kit Nutrición',
    'description': 'Bocados suaves para la primera fase de crecimiento. Alta concentración de calcio.',
    'price': '18.00',
    'unit': '/ 2kg'
  },
  {
    'id': 4,
    'category': 'juguetes',
    'tag': 'Interactivo',
    'title': 'Kong Extreme Resistente',
    'description': 'Caucho natural negro formulado para los masticadores más tenaces. Rellenable con premios.',
    'price': '15.90',
    'unit': None
  },
  {
    'id': 5,
    'category': 'juguetes',
    'tag': 'Gatos',
    'title': 'Torre Rasador multinivel',
    'description': 'Atrae al gato a jugar y afilarse las uñas sin dañar tus muebles. Incluye pelota colgante.',
    'price': '32.00',
    'unit': None
  },
  {
    'id': 6,
    'category': 'juguetes',
    'tag': 'Masticable',
    'title': 'Cuerda Dental de Algodón',
    'description': 'Ideal para juegos de tirar y para limpiar los dientes de tu perro mientras se divierte.',
    'price': '8.50',
    'unit': None
  }
]

def init_db():
    if not os.path.exists('data'):
        os.makedirs('data')
        
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            category TEXT NOT NULL,
            tag TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            price TEXT NOT NULL,
            unit TEXT
        )
    ''')
    
    # Comprobar si está vacía para insertar semillas
    c.execute('SELECT COUNT(*) FROM products')
    if c.fetchone()[0] == 0:
        for p in PRODUCTS_DATA:
            c.execute('''
                INSERT INTO products (id, category, tag, title, description, price, unit) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (p['id'], p['category'], p['tag'], p['title'], p['description'], p['price'], p['unit']))
    
    conn.commit()
    conn.close()

init_db()

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@app.route('/api/products', methods=['GET'])
def get_all_products():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = dict_factory
    c = conn.cursor()
    c.execute("SELECT * FROM products")
    products = c.fetchall()
    conn.close()
    return jsonify(products)

@app.route('/api/products/<category>', methods=['GET'])
def get_products_by_category(category):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = dict_factory
    c = conn.cursor()
    c.execute("SELECT * FROM products WHERE category = ?", (category,))
    products = c.fetchall()
    conn.close()
    return jsonify(products)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)
