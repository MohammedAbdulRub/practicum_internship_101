# SMB CRM Backend

A REST API backend for a small-to-medium business CRM built with Node.js, Express, and PostgreSQL. It manages three resources — customers, leads, and orders — and automatically scores every new lead (0–100) using a Groq LLM background job that runs after each `POST /leads` without blocking the response.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Database | PostgreSQL 16 |
| AI scoring | Groq — `llama-3.3-70b-versatile` |
| Containers | Docker + docker-compose |

---

## Quick Start

### 1. Configure secrets

```bash
cp .env.example .env
# Open .env and fill in your GROQ_API_KEY
# Get a free key at https://console.groq.com
```

### 2. Start everything

```bash
docker-compose up --build
```

This builds the Node.js image, starts PostgreSQL, waits for it to be healthy, then starts the API. Schema and seed data load automatically on first boot.

### 3. Verify

```bash
curl http://localhost:3000/health
# → {"status":"ok"}
```

---

## Environment Variables

Copy `.env.example` to `.env`. **Never commit `.env`** — it is git-ignored.

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Postgres hostname | `localhost` |
| `DB_PORT` | Postgres port | `5432` |
| `DB_NAME` | Database name | `smb_crm` |
| `DB_USER` | Postgres user | `postgres` |
| `DB_PASSWORD` | Postgres password | `postgres` |
| `PORT` | Express server port | `3000` |
| `GROQ_API_KEY` | Groq API key for lead scoring | — |

---

## API Endpoints

### Health

```bash
GET /health
# → {"status":"ok"}
```

---

### Leads

**Create a lead**
```bash
curl -X POST http://localhost:3000/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Jordan Blake","email":"jordan@venturecorp.io","company":"VentureCorp","source":"referral"}'
```

**List all leads**
```bash
curl http://localhost:3000/leads
```

**Filter by status**
```bash
curl "http://localhost:3000/leads?status=new"
# Valid statuses: new | contacted | qualified | converted | lost
```

**Update lead status**
```bash
curl -X PATCH http://localhost:3000/leads/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"contacted"}'
```

---

### Customers

**Create a customer**
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Nguyen","email":"alice@brightlogic.io","phone":"+1-415-555-0101","company":"BrightLogic Inc."}'
```

**List all customers**
```bash
curl http://localhost:3000/customers
```

**Get one customer**
```bash
curl http://localhost:3000/customers/1
```

**Update a customer**
```bash
curl -X PATCH http://localhost:3000/customers/1 \
  -H "Content-Type: application/json" \
  -d '{"company":"BrightLogic Ltd."}'
```

**Delete a customer**
```bash
curl -X DELETE http://localhost:3000/customers/1
```

---

### Orders

**Create an order**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"product_name":"CRM Pro Plan","amount":599.00}'
```

**List all orders**
```bash
curl http://localhost:3000/orders
```

**Filter by status and/or customer**
```bash
curl "http://localhost:3000/orders?status=pending"
curl "http://localhost:3000/orders?customer_id=1"
curl "http://localhost:3000/orders?status=delivered&customer_id=2"
# Valid statuses: pending | processing | shipped | delivered | cancelled
```

**Get one order**
```bash
curl http://localhost:3000/orders/3
```

**Update order status**
```bash
curl -X PATCH http://localhost:3000/orders/3/status \
  -H "Content-Type: application/json" \
  -d '{"status":"shipped"}'
```

---

## Groq Lead Scoring

When `POST /leads` is called, the API returns a `201` response immediately with `score: 0`. After the response is sent, `setImmediate` fires a background call to Groq's `llama-3.3-70b-versatile` model with the lead's name, email, company, and source. The model returns a single integer (0–100) representing lead quality, which is written back to `leads.score` in Postgres — typically within 1–2 seconds. The caller never waits for scoring, so latency is unaffected.

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `customers` | Existing paying clients |
| `leads` | Prospects moving through the sales pipeline |
| `orders` | Purchases linked to customers (FK → customers) |

Lead status lifecycle: `new` → `contacted` → `qualified` → `converted` → `lost`

---

## Design Notes

PostgreSQL was chosen because CRM data is relational by nature — customers own orders, leads reference sales reps, and foreign-key constraints enforce referential integrity without extra application logic. The current single-container design works well on managed platforms like Railway, Render, or Fly.io, where Postgres is provisioned as a managed add-on and a single API replica handles typical SMB traffic without orchestration overhead. Kubernetes becomes the right choice when traffic spikes require multiple API replicas with independent scaling, the Groq scoring job needs to run as a separate pod with its own resource limits and retry policy, or the team needs rolling deployments, self-healing, and cluster-level secrets management across environments.

---

## Project Structure

```
src/
  db/
    index.js              # pg connection pool
    schema.sql            # DDL — tables, triggers
    seed.sql              # sample data
    customersQueries.js   # SQL for customers
    leadsQueries.js       # SQL for leads
    ordersQueries.js      # SQL for orders
  controllers/
    customersController.js
    leadsController.js
    ordersController.js
  routes/
    customers.js
    leads.js
    orders.js
  jobs/
    scoreLead.js          # Groq background scoring
  index.js                # Express entry point
Dockerfile
docker-compose.yml
.env.example
```
