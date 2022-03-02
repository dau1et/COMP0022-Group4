FROM postgres
COPY dev/db/database.sql /docker-entrypoint-initdb.d/