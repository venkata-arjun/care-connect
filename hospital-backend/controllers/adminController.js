// Import MySQL connection pool to run DB operations
const pool = require("../config/db");

// Import password hashing utility for secure password storage
const { hashPassword } = require("../utils/password");

/*
  Controller: addDoctor()
  --------------------------------------------------
  - Used by admin to create a doctor account
  - Steps:
      1. Check if email already exists in the database
      2. Hash password before inserting
      3. Insert into users table with role = DOCTOR
      4. Insert doctor's specialization into doctors table
*/
const addDoctor = async (req, res) => {
  const { name, email, password, specialization } = req.body;

  try {
    // Check if another user already uses this email
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Securely hash password before saving
    const password_hash = await hashPassword(password);

    // Insert base user record with DOCTOR role
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'DOCTOR')",
      [name, email, password_hash]
    );

    // Insert extra doctor-specific information
    await pool.query(
      "INSERT INTO doctors (user_id, specialization) VALUES (?, ?)",
      [result.insertId, specialization]
    );

    res.status(201).json({ message: "Doctor created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add doctor" });
  }
};

/*
  Controller: getStats()
  --------------------------------------------------
  - Used by admin to view overall application statistics
  - Fetches count of:
      • all users
      • all doctors
      • all patients
      • all appointments
*/
const getStats = async (req, res) => {
  try {
    // Count total users
    const [[users]] = await pool.query("SELECT COUNT(*) AS users FROM users");

    // Count doctors
    const [[doctors]] = await pool.query(
      "SELECT COUNT(*) AS doctors FROM doctors"
    );

    // Count patients
    const [[patients]] = await pool.query(
      "SELECT COUNT(*) AS patients FROM patients"
    );

    // Count appointments
    const [[appointments]] = await pool.query(
      "SELECT COUNT(*) AS appointments FROM appointments"
    );

    // Return statistics in response
    res.json({
      users: users.users,
      doctors: doctors.doctors,
      patients: patients.patients,
      appointments: appointments.appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// Export admin-specific controller functions
module.exports = {
  addDoctor,
  getStats,
};

/*
Additional Admin Controllers
--------------------------------------------------
- getDoctors: list all doctors with profile info
- getPatients: list all patients with profile info
- getRecentAppointments: latest appointments for activity view
*/
const getDoctors = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT d.id, u.name, u.email, d.specialization
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       ORDER BY u.name ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

const getPatients = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, u.name, u.email, p.phone
       FROM patients p
       JOIN users u ON p.user_id = u.id
       ORDER BY u.name ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

const getRecentAppointments = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.date_time, a.status,
              du.name AS doctor_name, du.email AS doctor_email,
              pu.name AS patient_name, pu.email AS patient_email
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN users du ON d.user_id = du.id
       JOIN patients p ON a.patient_id = p.id
       JOIN users pu ON p.user_id = pu.id
       ORDER BY a.date_time DESC
       LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};

module.exports = {
  addDoctor,
  getStats,
  getDoctors,
  getPatients,
  getRecentAppointments,
};
