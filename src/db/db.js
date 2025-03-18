const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Necessário para conexão com Tembo.io
  },
});

pool.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to PostgreSQL:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL successfully!");
  }
});

module.exports = pool;
