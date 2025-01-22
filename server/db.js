const { Pool } = require('pg');
require('dotenv').config()

const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const database_name = process.env.DB_NAME;

// Ensure password is a string
if (typeof db_password !== 'string') {
  console.error('Error: DB_PASSWORD is not a valid string');
  process.exit(1);
}

// Create a new PostgreSQL connection pool
const pool = new Pool({
  user: db_user,
  host: process.env.DB_HOST,
  database: database_name,
  password: db_password,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
