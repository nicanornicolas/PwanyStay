-- Convert tags column from text[] to jsonb for more flexible storage
ALTER TABLE resources
  ALTER COLUMN tags TYPE jsonb USING to_jsonb(tags);

-- Ensure a sensible default for new rows
ALTER TABLE resources
  ALTER COLUMN tags SET DEFAULT '[]'::jsonb;
