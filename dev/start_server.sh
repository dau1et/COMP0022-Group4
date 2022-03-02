#!/bin/bash
set -e
if [[ ! -f "/SETUP_DB" ]]
then
    echo "Populating the Database..."
    sleep 2
    /code/venv/bin/python populate_db.py
    echo "Populated the Database! :)"
    touch /SETUP_DB
else
    echo "Database Already Populated."
fi

/code/venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 80 --reload
