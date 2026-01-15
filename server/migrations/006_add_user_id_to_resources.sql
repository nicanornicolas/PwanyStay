-- Add user_id column to resources table
ALTER TABLE resources ADD COLUMN user_id INTEGER REFERENCES users(id);

-- Create index for user_id
CREATE INDEX IF NOT EXISTS idx_resources_user_id ON resources (user_id);