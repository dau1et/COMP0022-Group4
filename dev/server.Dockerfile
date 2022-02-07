# DEV DOCKERFILE
FROM python:3.10-bullseye
WORKDIR /code
COPY dev/requirements.txt /code/requirements.txt
RUN python3 -m venv /code/venv && \
    /code/venv/bin/python -m pip install --no-cache-dir --upgrade pip && \
    /code/venv/bin/python -m pip install --no-cache-dir --upgrade -r requirements.txt
ENTRYPOINT ["/code/venv/bin/python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
