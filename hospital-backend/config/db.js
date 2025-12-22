// Import MySQL2 library with Promise support (so we can use async/await)
const mysql = require("mysql2/promise");

// Load environment variables from .env into process.env
require("dotenv").config();

// Create a connection pool to MySQL
// A pool maintains multiple connections and reuses them for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Database server (e.g. localhost)
  user: process.env.DB_USER, // MySQL username
  password: process.env.DB_PASSWORD, // MySQL password
  database: process.env.DB_NAME, // Database name to use

  // Pool behavior settings
  waitForConnections: true, // If all connections are busy, wait instead of failing
  connectionLimit: 10, // Max number of active connections
  queueLimit: 0, // Unlimited queued requests waiting for a connection
});

// Test the database connection
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

// Export the pool so we can run SQL queries from other files
module.exports = pool;

/*
Quick Notes:
- Always keep DB credentials inside .env (never push them to GitHub).
- Using a "pool" is better than a single connection for real applications.
- Use async/await with: const [rows] = await pool.query("SELECT * FROM users");
*/
