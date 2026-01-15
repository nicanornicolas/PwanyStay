require('dotenv').config();
const { Pool } = require('pg');

console.log("Attempting to connect to:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error("❌ Connection Error:", err.message);
    console.log("HINT: Check if your IP is whitelisted on Render Access Control.");
  } else {
    console.log("✅ Success! Database connected at:", res.rows[0].now);
  }
  process.exit();
});