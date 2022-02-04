# DEV DOCKERFILE
FROM python:3.10-bullseye
WORKDIR /app
RUN python3 -m venv /app/venv
RUN /app/venv/bin/python -m pip install --upgrade pip
COPY dev/requirements.txt /app/requirements.txt
RUN /app/venv/bin/python -m pip install -r requirements.txt
VOLUME /app/src
ENTRYPOINT ["/app/venv/bin/python", "/app/src/main.py"]
