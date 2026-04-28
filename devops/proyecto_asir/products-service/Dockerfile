FROM peedroorgzz/ciber
USER root
ENTRYPOINT []

RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/petstore/products-service

COPY requirements.txt .
RUN python3 -m venv venv && \
    ./venv/bin/pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 4000

CMD ["./venv/bin/gunicorn", "--bind", "0.0.0.0:4000", "--workers", "2", "app:app"]
