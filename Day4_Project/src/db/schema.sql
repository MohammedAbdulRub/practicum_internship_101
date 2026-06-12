-- SMB CRM Schema
-- Three core tables: customers, leads, orders

CREATE TABLE IF NOT EXISTS customers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  phone      VARCHAR(50),
  company    VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- status lifecycle: new → contacted → qualified → converted → lost
CREATE TABLE IF NOT EXISTS leads (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(50),
  company     VARCHAR(255),
  source      VARCHAR(100),          -- website | referral | cold_outreach | event
  status      VARCHAR(50)  NOT NULL DEFAULT 'new',
  score       INTEGER      NOT NULL DEFAULT 0,   -- 0-100, set by lead-scoring job
  notes       TEXT,
  assigned_to VARCHAR(255),                       -- sales rep name or ID
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id           SERIAL PRIMARY KEY,
  customer_id  INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_name VARCHAR(255)    NOT NULL,
  amount       NUMERIC(10, 2)  NOT NULL,
  status       VARCHAR(50)     NOT NULL DEFAULT 'pending',  -- pending | processing | shipped | delivered | cancelled
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- Automatically bump updated_at on every UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
