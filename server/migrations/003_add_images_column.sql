-- Add images jsonb column to resources table
ALTER TABLE resources
  ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
