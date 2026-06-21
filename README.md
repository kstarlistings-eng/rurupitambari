# Ruru Pitambari

Inventory, production, and sales management system with role-based access.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, Zustand
- **Backend:** Node.js, Express, PostgreSQL
- **Auth:** JWT access + refresh tokens

## Roles

| Role | Permissions |
|------|-------------|
| Admin/Finance | Full access to all modules and financial data |
| Production Operator | Raw material inventory + production logging only |
| Store Operator | Finished goods inventory + receive transfers only |

## Quick Start

### 1. Start the backend

```bash
cd backend

# Option A: using Docker (if your user has Docker permissions)
docker compose up -d

# Option B: using a local PostgreSQL cluster on port 5433
# (see backend/README.md for full local setup commands)

npm install
npm run migrate:up
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2. Start the frontend

```bash
# from project root
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (or the next available port).

### 3. Login

Use one of the seeded accounts:

| Email | Password | Role |
|-------|----------|------|
| `admin@pitambari.com` | `admin123` | Admin/Finance |
| `production@pitambari.com` | `production123` | Production Operator |
| `store@pitambari.com` | `store123` | Store Operator |

## Workflows

1. **Procurement:** Admin creates an Expense → raw material stock increases.
2. **Production:** Production Operator creates a Production Order → raw material stock decreases and a pending Transfer is created.
3. **Receive Goods:** Store Operator receives the Transfer → finished goods stock increases.
4. **Sales:** Admin onboards a Seller and creates a Sales Dispatch → finished goods stock decreases and an Invoice is generated.

## Project Structure

```
/backend          Node.js/Express API
/src              React frontend
  /components     UI components
  /pages          Page components
  /schema         Zod validation schemas
  /services       API service functions
  /store          Zustand stores
  /config         Endpoints, query keys, axios config
```
