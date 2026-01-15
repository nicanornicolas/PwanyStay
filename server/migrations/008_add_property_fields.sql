-- Add property-specific fields to resources table with defaults
ALTER TABLE resources
  ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Apartment',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Create indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_resources_bedrooms ON resources (bedrooms);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources (type);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources (status);

-- Backfill existing records with default values
UPDATE resources SET bedrooms = 1 WHERE bedrooms IS NULL;
UPDATE resources SET type = 'Apartment' WHERE type IS NULL;
UPDATE resources SET status = 'active' WHERE status IS NULL;