FROM peedroorgzz/ciber
USER root

# Resetear el ENTRYPOINT de la imagen base (start.sh crea usuarios SSH, no lo necesitamos)
ENTRYPOINT []

# Instalar Python3 y pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo del microservicio
WORKDIR /opt/petstore/auth-service

# Instalar dependencias en un virtualenv
COPY requirements.txt .
RUN python3 -m venv venv && \
    ./venv/bin/pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

EXPOSE 5000

CMD ["./venv/bin/gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]
