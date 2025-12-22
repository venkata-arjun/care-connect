// Import the MySQL connection pool to execute queries on the database
// This allows us to reuse efficient DB connections created in config/db.js
const pool = require("../config/db");

// Import JSON Web Token library
// Used to create secure login tokens for authentication
const jwt = require("jsonwebtoken");

// Import functions for password hashing and verification
// hashPassword → converts a plaintext password into a secure hashed form
// comparePassword → checks if plaintext password matches the stored hash
const { hashPassword, comparePassword } = require("../utils/password");

// Load environment variables such as JWT_SECRET from the .env file
require("dotenv").config();

/*
  Helper Function: generateToken(user)
  ------------------------------------------------------
  Creates a JWT token which identifies the logged-in user.
  What we store inside the token:
    - id: Used for identifying user in DB
    - role: Helps authorize based on permission level (ADMIN/DOCTOR/PATIENT)
    - email: Additional identity data
  Signed using our secret key (JWT_SECRET)
  Expiry: 7 days → after that the user must log in again
*/
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/*
  Controller: signup()
  ------------------------------------------------------
  - Registers a new account in the system
  - Steps:
      1. Validate request data (name, email, password, role)
      2. Check if email already exists (avoid duplicates)
      3. Hash password for security (never store raw passwords)
      4. Insert user record into the `users` table
      5. Insert extra role-based info:
          - DOCTOR → store specialization inside doctors table
          - PATIENT → store phone inside patients table
      6. Create a JWT token and return it for auto-login after signup
*/
const signup = async (req, res) => {
  const { name, email, password, role, specialization, phone } = req.body;

  try {
    // Check if a user already exists with the same email
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      // Email duplicate → tell client to choose another
      return res.status(400).json({ message: "Email already exists" });
    }

    // Convert password into a secure hashed value before saving
    const password_hash = await hashPassword(password);

    // Insert into users table (base table for all roles)
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, password_hash, role]
    );

    // Newly created user ID returned from DB insert
    const userId = result.insertId;

    // Handle role-specific table entries
    if (role === "DOCTOR") {
      // Add doctor details into doctors table
      await pool.query(
        "INSERT INTO doctors (user_id, specialization) VALUES (?, ?)",
        [userId, specialization]
      );
    } else if (role === "PATIENT") {
      // Add patient details into patients table
      await pool.query("INSERT INTO patients (user_id, phone) VALUES (?, ?)", [
        userId,
        phone,
      ]);
    }

    // Auto-generate token for immediate login after successful signup
    const token = generateToken({ id: userId, email, role });

    // Respond with token and user role
    res.status(201).json({ token, role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/*
  Controller: login()
  ------------------------------------------------------
  - Authenticates a user and returns an access token
  - Steps:
      1. Check if the email exists in database
      2. Compare input password with hashed password stored in DB
      3. If match → generate token and allow login
      4. If incorrect → return "Invalid credentials"
*/
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve user data by email
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      // No account found with this email
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Check hashed password against user input
    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      // Password incorrect
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Credentials correct → create and send JWT token
    const token = generateToken(user);

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// Export authentication controller functions
// Used by routes/authRoutes.js
module.exports = {
  signup,
  login,
};
