// Import Express framework to create the server and handle routes
const express = require("express");

// Import CORS to allow requests from different domains (frontend + backend communication)
const cors = require("cors");

// Load environment variables from .env file into process.env
require("dotenv").config();

// Import MySQL connection pool for database queries
const pool = require("./config/db");

// Import route modules for separating API logic
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Create the main Express application instance
const app = express();

// Enable CORS for all incoming requests to avoid cross-origin issues
app.use(cors());

// Enable JSON body parsing for incoming requests (so req.body works)
app.use(express.json());

/*
  Health Check API
  - Confirms server is running
  - Confirms database connection is healthy
*/
app.get("/health", async (req, res) => {
  try {
    // Run a simple test query to verify DB connectivity
    const [rows] = await pool.query("SELECT 1 AS result");

    // Response if everything is working
    res.json({ status: "ok", db: rows[0].result });
  } catch (err) {
    console.error(err);

    // Response if database is down or connection fails
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});

// Attach authentication routes -> All endpoints inside authRoutes will start with /auth
app.use("/auth", authRoutes);

// Attach appointment-related APIs under /appointments
app.use("/appointments", appointmentRoutes);

// Attach doctor-related APIs under /doctor
app.use("/doctor", doctorRoutes);

// Attach admin-related APIs under /admin
app.use("/admin", adminRoutes);

// PORT setup: take from .env or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

  // Debug DB info (development only)
  if (process.env.NODE_ENV !== "production") {
    app.get("/debug/db", async (req, res) => {
      try {
        // List all tables and return simple counts for key tables
        const [tables] = await pool.query("SHOW TABLES");

        // Attempt safe counts (wrap each in try/catch to avoid failure if table missing)
        const counts = {};
        async function tryCount(tableName, key) {
          try {
            const [[row]] = await pool.query(`SELECT COUNT(*) AS c FROM ${tableName}`);
            counts[key] = row.c;
          } catch (e) {
            counts[key] = null;
          }
        }

        await Promise.all([
          tryCount("users", "users"),
          tryCount("doctors", "doctors"),
          tryCount("patients", "patients"),
          tryCount("appointments", "appointments"),
          tryCount("prescriptions", "prescriptions"),
        ]);

        res.json({ ok: true, tables, counts });
      } catch (err) {
        console.error("/debug/db error:", err);
        res.status(500).json({ ok: false, error: err?.message || String(err) });
      }
    });
  }
/*
Quick Notes for New Learners:
- This is the main entry file for the backend server.
- Routes are separated for clean folder structure and easy maintenance.
- CORS + JSON middleware are essential for frontend communication.
- Health check is useful for deployment monitoring.
*/
