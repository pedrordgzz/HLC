@echo off
echo ==========================================
echo     Iniciando Microservicios PetStore
echo ==========================================

echo [1/3] Iniciando Frontend (React + Vite)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo [2/3] Iniciando Auth Service (Flask / Puerto 5000)...
start "Auth Service" cmd /k "cd auth-service && .\venv\Scripts\python app.py"

echo [3/3] Iniciando Products Service (Flask / Puerto 4000)...
start "Products Service" cmd /k "cd products-service && .\venv\Scripts\python app.py"

echo.
echo Todos los servicios se han lanzado en ventanas separadas.
echo Cierra las ventanas individuales para detener cada servicio.
echo ==========================================
