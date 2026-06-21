# Ruru Pitambari Backend

Node.js + Express + PostgreSQL backend for inventory, production, and sales management.

## Prerequisites

- Node.js 20+
- PostgreSQL (local or Docker)

## Setup

The repository includes a `docker-compose.yml`, but if your user does not have Docker permissions you can run a local PostgreSQL cluster on port 5433 using the installed Postgres binaries:

```bash
cd backend

# Start a local PostgreSQL cluster on port 5433
mkdir -p .postgres-data .postgres-sockets
/usr/lib/postgresql/18/bin/initdb -D .postgres-data --auth=trust --no-locale --encoding=UTF8 -U postgres
echo "port = 5433" >> .postgres-data/postgresql.conf
echo "listen_addresses = 'localhost'" >> .postgres-data/postgresql.conf
echo "unix_socket_directories = '$(pwd)/.postgres-sockets'" >> .postgres-data/postgresql.conf
/usr/lib/postgresql/18/bin/pg_ctl -D .postgres-data -l .postgres-data/server.log start

# Create user and database
/usr/lib/postgresql/18/bin/psql -h localhost -p 5433 -U postgres -c "CREATE USER pitambari WITH PASSWORD 'pitambari';"
/usr/lib/postgresql/18/bin/psql -h localhost -p 5433 -U postgres -c "CREATE DATABASE pitambari OWNER pitambari;"

# Copy env and install dependencies
cp .env.example .env
npm install

# Run migrations
npm run migrate:up

# Seed default users
npm run seed
```

If you use Docker:

```bash
docker compose up -d
npm install
npm run migrate:up
npm run seed
```

## Default Users

| Role | Email | Password |
|------|-------|----------|
| Admin / Finance | `admin@pitambari.com` | `admin123` |
| Production Operator | `production@pitambari.com` | `production123` |
| Store Operator | `store@pitambari.com` | `store123` |

## Run

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

## API Overview

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `/api/raw-materials`
- `/api/expenses`
- `/api/production-orders`
- `/api/transfers`
- `/api/finished-goods`
- `/api/sellers`
- `/api/sales-dispatches`
- `/api/invoices`
