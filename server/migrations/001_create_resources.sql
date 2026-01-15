-- Create resources table with fields used by the API
-- Run this migration once against your Postgres database
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  image TEXT,
  location TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create a simple index on created_at for ordering queries
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources (created_at DESC);
