# COMP0022 - Group 4

## Getting Started

### Prerequisites:

- git
- python3
- docker & docker-compose
- node & npm

### Clone the Repository:

```
git@github.com:dau1et/COMP0022-Group4.git
cd COMP0022-Group4
```

### Create the Required Data:

First install:
```
pip3 install aiohttp
```
Then,

```
cd csv_data
python3 create_csv_tables.py
```

### Startup the Database, Backend, Redis, and Jaeger Services:

```
cd ../dev
docker-compose up --build
```

(OPTIONAL) To enable database backups, run:
```
./start_backups
```

### Startup the Client:

```
cd ../client
npm install
npm run start
```

### Finally,

Navigate to http://localhost:3000 and enjoy the Movie Analytics app :)