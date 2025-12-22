// Import the MySQL connection pool to run database queries
const pool = require("../config/db");

/*
  Controller: bookAppointment()
  --------------------------------------------------
  - Allows a logged-in patient to book an appointment with a doctor
  - Expects:
      • doctor_id  → from request body
      • date_time  → from request body (appointment date & time)
  - Uses:
      • patient_id → taken from req.user (set by auth middleware)
*/
const bookAppointment = async (req, res) => {
  const { doctor_id, date_time } = req.body;

  try {
    // Resolve current patient's internal id from logged-in user's id
    const user_id = req.user.id;
    const [[patient]] = await pool.query(
      "SELECT id FROM patients WHERE user_id = ?",
      [user_id]
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    // Insert a new appointment record into the appointments table
    await pool.query(
      "INSERT INTO appointments (doctor_id, patient_id, date_time) VALUES (?, ?, ?)",
      [doctor_id, patient.id, date_time]
    );

    // Success response after appointment is created
    res.status(201).json({ message: "Appointment booked" });
  } catch (err) {
    // Handle duplicate booking error (same doctor, same time)
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "Doctor not available at this time" });
    }

    // Log unexpected errors and return generic failure
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};

/*
  Controller: getMyAppointments()
  --------------------------------------------------
  - Returns all appointments for the currently logged-in patient
  - Reads patient_id from the JWT (req.user.id)
  - Joins appointments with doctors table to show doctor details
*/
const getMyAppointments = async (req, res) => {
  try {
    // Resolve patient internal id from logged-in user id
    const user_id = req.user.id;
    const [[patient]] = await pool.query(
      "SELECT id FROM patients WHERE user_id = ?",
      [user_id]
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    /*
    Fetch appointments with doctor details for this patient
    Also include prescription (if any) by left-joining prescriptions
    */
    // Only select columns that exist in your schema
    const result = await pool.query(
      `SELECT 
         a.id, 
         a.date_time, 
         a.status, 
         d.id AS doctor_id, 
         d.specialization,
         p.notes AS prescription_text,
         p.diagnosis AS prescription_diagnosis
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN prescriptions p ON p.appointment_id = a.id
       WHERE a.patient_id = ?
       ORDER BY a.date_time DESC`,
      [patient.id]
    );
    const rows = result[0];

    // Map rows to include a nested `prescription` object when present
    const mapped = rows.map((r) => {
      const appointment = {
        id: r.id,
        date_time: r.date_time,
        status: r.status,
        doctor_id: r.doctor_id,
        specialization: r.specialization,
      };

      if (r.prescription_text || r.prescription_diagnosis) {
        appointment.prescription = {
          text: r.prescription_text,
          diagnosis: r.prescription_diagnosis,
        };
      } else {
        appointment.prescription = null;
      }

      return appointment;
    });

    // Return the list of appointments as JSON
    res.json(mapped);
  } catch (err) {
    console.error(err);
    // Development helper: include the error message in the response body
    // so the frontend can show more details while debugging.
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: err?.message || String(err),
    });
  }
};

/*
  Controller: updatePatientProfile()
  --------------------------------------------------
  - Allows a logged-in patient to update their profile information
  - Expects:
      • name, phone, dob, bloodType, allergies → from request body
  - Uses:
      • user_id → taken from req.user (set by auth middleware)
*/
const updatePatientProfile = async (req, res) => {
  const { name, phone, dob, bloodType, allergies, joinDate } = req.body;

  try {
    const user_id = req.user.id;

    // Update users table (name only)
    if (name) {
      await pool.query("UPDATE users SET name = ? WHERE id = ?", [
        name,
        user_id,
      ]);
    }

    // Allow updating the user's signup/join date if provided
    if (joinDate !== undefined && joinDate !== "") {
      try {
        await pool.query("UPDATE users SET created_at = ? WHERE id = ?", [
          joinDate,
          user_id,
        ]);
      } catch (err) {
        console.warn("Could not update users.created_at:", err?.message || err);
      }
    }

    // Update patients table fields individually so a missing column
    // doesn't cause the whole update to fail (some schemas don't have all columns)
    async function tryUpdate(columnSql, value) {
      try {
        await pool.query(`UPDATE patients SET ${columnSql} WHERE user_id = ?`, [
          value,
          user_id,
        ]);
      } catch (err) {
        // Ignore errors caused by missing columns, log others
        if (err && err.code === "ER_BAD_FIELD_ERROR") {
          console.warn(
            `Skipping update for ${columnSql} — column may not exist.`
          );
        } else {
          console.error(`Failed to update ${columnSql}:`, err);
        }
      }
    }

    if (phone !== undefined && phone !== "") {
      await tryUpdate("phone = ?", phone);
    }
    if (dob !== undefined && dob !== "") {
      await tryUpdate("dob = ?", dob);
    }
    if (bloodType !== undefined && bloodType !== "") {
      await tryUpdate("blood_type = ?", bloodType);
    }
    if (allergies !== undefined && allergies !== "") {
      await tryUpdate("allergies = ?", allergies);
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/*
  Controller: getPatientProfile()
  --------------------------------------------------
  - Returns the currently logged-in patient's profile information
  - Reads user_id from the JWT (req.user.id)
  - Returns name, email, phone from users and patients tables
*/
const getPatientProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Fetch user and patient details
    const [[userRecord]] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [user_id]
    );

    if (!userRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    const [[patientRecord]] = await pool.query(
      "SELECT phone FROM patients WHERE user_id = ?",
      [user_id]
    );

    res.json({
      name: userRecord.name,
      email: userRecord.email,
      phone: patientRecord?.phone || "",
      created_at: userRecord.created_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// Export controllers for use in routes/appointmentRoutes.js
module.exports = {
  bookAppointment,
  getMyAppointments,
  updatePatientProfile,
  getPatientProfile,
};
