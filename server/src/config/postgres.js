const { Pool } = require('pg');

// Support both individual PG_* env vars and a DATABASE_URL connection string.
// Many hosted providers (Render, Heroku) provide DATABASE_URL and require SSL.
const connectionString = process.env.DATABASE_URL || null;

const poolOptions = connectionString
  ? {
      connectionString,
      // When using a hosted Postgres, SSL is often required. Allow opt-out by setting PGSSLMODE=disable
      ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
    }
  : {
      host: process.env.PGHOST || 'localhost',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'pwanystay',
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    };

const pool = new Pool(poolOptions);

pool.on('error', (err) => {
  console.error('Unexpected Postgres client error', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
