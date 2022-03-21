#!/bin/sh
# Run Once at the Start
set -e
/usr/bin/docker exec -t movie-db-db-1 bash -c 'mkdir /var/lib/postgresql/data/backups'
crontab -l | { cat; echo "*/1 * * * * /usr/bin/docker exec -t movie-db-db-1 bash -c 'PGPASSWORD=moviedb-dev pg_dump moviedb -U moviedb-dev --file=/var/lib/postgresql/data/backups/moviedb-backup.sql'"; } | crontab -
echo "Backups Have Been Instantiated and the Cronjob Has Been Started!"
