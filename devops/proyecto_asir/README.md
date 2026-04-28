# PetStore - Microservicios de Verificación de Correos

Proyecto intermodular de ASIR: Microservicio de seguridad descentralizado (SaaS) para verificación de correos electrónicos, con arquitectura de microservicios desplegable mediante Docker y automatizable con Ansible.

## Arquitectura

```
proyecto_asir/
│
├── frontend/                        # Frontend React + Vite (puerto 3000 / 80 en Docker)
│   ├── Dockerfile                   # Multi-stage: peedroorgzz/nodejs → peedroorgzz/nginx
│   ├── nginx/default.conf           # Config Nginx para SPA
│   └── src/
│
├── auth-service/                    # Microservicio Auth - Validación COMPLETA (puerto 5000)
│   ├── Dockerfile                   # Basado en peedroorgzz/ciber
│   ├── app.py                       # email-validator + MX + disposable-email-domains + Debounce API
│   └── requirements.txt
│
├── auth-service-lista-cerrada/      # Microservicio Auth - LISTA CERRADA (puerto 5003)
│   ├── Dockerfile                   # Basado en peedroorgzz/ciber
│   ├── app.py                       # Solo admite gmail, hotmail, outlook, yahoo... (11 dominios)
│   └── requirements.txt
│
├── products-service/                # Microservicio de Productos (puerto 4000)
│   ├── Dockerfile
│   └── app.py
│
├── web-sin-validacion/              # Demo standalone - SIN validación (puerto 5001)
│   ├── Dockerfile
│   ├── app.py
│   └── templates/register.html
│
├── web-lista-cerrada/               # Demo standalone - Lista cerrada (puerto 5002)
│   ├── Dockerfile
│   ├── app.py
│   └── templates/register.html
│
├── nginx/                           # Gateway (Reverse Proxy)
│   ├── Dockerfile.gateway           # Basado en peedroorgzz/nginx
│   └── gateway.conf                 # Upstream routing
│
├── ansible/                         # Automatización de despliegue
│   ├── inventory.ini                # Inventario de servidores
│   ├── deploy-vps.yml               # Desplegar TODO en VPS con Docker Compose
│   ├── deploy-microservicio.yml     # Desplegar microservicio en sistemas existentes
│   └── roles/microservicio/         # Rol reutilizable (systemd + gunicorn)
│
├── docker-compose.yml               # Orquestación de todos los servicios
├── .env.production                  # Variables de entorno (template)
├── .dockerignore
└── start_services.bat               # Arranque local en Windows (desarrollo)
```

## Tabla de Puertos

| Servicio | Puerto | Descripción |
|---|---|---|
| Frontend (React) | 3000 (dev) / 80 (prod) | Interfaz web principal |
| Auth Service | 5000 | Validación con librería completa |
| Auth Service Lista Cerrada | 5003 | Validación con whitelist de dominios |
| Products Service | 4000 | API de productos |
| Web Sin Validación | 5001 | Demo sin ninguna validación |
| Web Lista Cerrada | 5002 | Demo con lista cerrada standalone |
| Gateway | 80 | Reverse proxy (solo Docker) |

## Desarrollo Local (Windows)

```bash
# Opción 1: Script automático
start_services.bat

# Opción 2: Manual (cada uno en su terminal)
cd auth-service && .\venv\Scripts\python app.py
cd products-service && .\venv\Scripts\python app.py
cd frontend && npm run dev
```

## Despliegue en VPS (Docker Compose)

```bash
# 1. Editar las variables de entorno
cp .env.production .env
nano .env  # Poner IP real y clave secreta

# 2. Levantar todo
docker compose up -d --build

# Acceder:
# http://TU_IP/                        → Frontend React
# http://TU_IP/demo/sin-validacion/    → Demo sin validación
# http://TU_IP/demo/lista-cerrada/     → Demo lista cerrada
# http://TU_IP/api/auth/               → API Auth (librería)
# http://TU_IP/api/auth-lista-cerrada/ → API Auth (whitelist)
# http://TU_IP/api/products/           → API Products
```

## Despliegue con Ansible

```bash
cd ansible

# Desplegar TODO en VPS (Docker Compose)
ansible-playbook -i inventory.ini deploy-vps.yml

# Desplegar auth-service (librería) en sistemas clientes
ansible-playbook -i inventory.ini deploy-microservicio.yml

# Desplegar auth-service-lista-cerrada en sistemas clientes
ansible-playbook -i inventory.ini deploy-microservicio.yml \
  -e "servicio=auth-service-lista-cerrada servicio_puerto=5003"
```

## Cadena de Imágenes Docker (HLC/Caronte)

Todas las imágenes están basadas en las imágenes personalizadas del curso:

```
ubuntu → peedroorgzz/ubbase → peedroorgzz/ciber → peedroorgzz/nginx → peedroorgzz/nodejs
```

## Autores

- **Matías García Martínez**
- **Pedro Juan Rodríguez Giménez**

2ºASIR - Proyecto Intermodular
