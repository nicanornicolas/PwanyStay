const fs = require('fs');
const path = require('path');
// Load .env so DATABASE_URL and other PG_* vars are available to the postgres config
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('../src/config/postgres');

async function run() {
  try {
    console.log('Using DATABASE_URL:', (process.env.DATABASE_URL || '').replace(/(\/\/)([^:]+):(.+@)/, '$1***:***@') || '(none)');
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

    // Ensure migrations tracking table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT now()
      )
    `);

    const appliedRows = (await db.query('SELECT filename FROM migrations')).rows.map((r) => r.filename);

    for (const file of files) {
      if (appliedRows.includes(file)) {
        console.log('Skipping already-applied migration', file);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log('Applying migration', file);
      await db.query('BEGIN');
      try {
        await db.query(sql);
        await db.query('INSERT INTO migrations(filename) VALUES ($1) ON CONFLICT DO NOTHING', [file]);
        await db.query('COMMIT');
      } catch (applyErr) {
        await db.query('ROLLBACK');
        throw applyErr;
      }
    }

    console.log('Migrations applied successfully');
    // close pool if available
    if (db && db.pool && typeof db.pool.end === 'function') await db.pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message || err);
    try { if (db && db.pool && typeof db.pool.end === 'function') await db.pool.end(); } catch (e) {}
    process.exit(1);
  }
}

run();
