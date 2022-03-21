# DEV DOCKERFILE
FROM python:3.10-bullseye
WORKDIR /code
COPY dev/requirements.txt /code/requirements.txt
RUN python3 -m venv /code/venv && \
    /code/venv/bin/python -m pip install --no-cache-dir --upgrade pip && \
    /code/venv/bin/python -m pip install --no-cache-dir --upgrade -r requirements.txt
COPY csv_data /code/csv_data
COPY dev/start_server.sh /code/start_server.sh
COPY dev/db/database.sql /code/database.sql
COPY dev/.env /code/.env
COPY dev/populate_db.py /code/populate_db.py
# COPY app /code/app  for deployment, unmount the volume from the docker-compose.yml, and uncomment this line.
ENTRYPOINT ["/bin/bash", "/code/start_server.sh"]

# ENTRYPOINT ["/code/venv/bin/python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
