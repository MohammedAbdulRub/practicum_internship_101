# Sector Daily Logger

## Purpose
A full-stack web app for restaurant staff to log daily sales and customer counts, view running totals, and explore trends via a chart. Built as an internship practicum project with an Azure deployment path.

## Stack
| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Python 3.11+, FastAPI, SQLAlchemy, SQLite |
| Frontend | React 18, Vite, Recharts                |
| Tests    | pytest, httpx, FastAPI TestClient       |
| DB       | SQLite (local dev) / configurable via env |

## Project Structure
```
backend/    FastAPI app + ORM models + API routers + tests
frontend/   React + Vite SPA
```

## Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload          # http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                        # http://localhost:5173
```

### Tests
```bash
cd backend
pytest tests/
```

## Environment Variables
| Variable       | Default                          | Purpose                  |
|----------------|----------------------------------|--------------------------|
| `DATABASE_URL` | `sqlite:///./sector_logger.db`   | SQLAlchemy connection URL |

Set `DATABASE_URL` to a different SQLite path or (for Azure) an Azure SQL / Postgres connection string.

## API Endpoints
| Method | Path            | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/api/log`      | Add or update a daily entry (upsert) |
| GET    | `/api/summary`  | Totals + time series + today's entry |

## Conventions
- Sector is hard-coded as `"restaurant"` in the frontend form; the backend accepts any sector string for future extensibility.
- Dates are ISO-8601 strings (`YYYY-MM-DD`).
- The `(date, sector)` pair is unique — a second POST for the same date/sector updates rather than duplicates.
- Backend CORS allows `http://localhost:5173` for local dev; update `main.py` origins for production.
- Frontend uses Vite's proxy (`/api → http://localhost:8000`) in dev; point to the deployed backend URL in production builds via `VITE_API_BASE`.
