// Import MySQL connection pool to run database queries
const pool = require("../config/db");

/*
  Controller: getDoctorAppointments()
  --------------------------------------------------
  - Allows a logged-in doctor to view all of their appointments
  - Steps:
      1. Identify which doctor is making the request using req.user.id
      2. Verify the user exists in the doctors table
      3. Fetch appointments assigned to that doctor
      4. Include patient details by joining patients and users tables
*/
const getDoctorAppointments = async (req, res) => {
  const user_id = req.user.id; // Logged-in doctor’s user ID from token

  try {
    // Find the doctor's internal ID using user_id
    const [[doctor]] = await pool.query(
      "SELECT id FROM doctors WHERE user_id = ?",
      [user_id]
    );

    // If not found, the logged-in user is not a doctor
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Fetch all appointments belonging to this doctor with patient info
    const [rows] = await pool.query(
      ` SELECT 
          a.id, 
          a.date_time, 
          a.status,
          u.name AS patient_name,
          u.email AS patient_email
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE a.doctor_id = ?
        ORDER BY a.date_time ASC`,
      [doctor.id]
    );

    res.json(rows); // Send appointments back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get appointments" });
  }
};

/*
  Controller: addPrescription()
  --------------------------------------------------
  - Allows doctor to add a prescription for a specific appointment
  - Steps:
      1. Validate the logged-in user is a doctor
      2. Check if the requested appointment exists
      3. Ensure that appointment belongs to the logged-in doctor
      4. Insert prescription record into database
      5. Update appointment status to COMPLETED
*/
const addPrescription = async (req, res) => {
  const {
    appointment_id,
    medicine_name,
    dosage,
    prescription_text,
    diagnosis,
  } = req.body;
  const user_id = req.user.id; // From token

  try {
    // Validate the user is in doctors table
    const [[doctor]] = await pool.query(
      "SELECT id FROM doctors WHERE user_id = ?",
      [user_id]
    );

    if (!doctor) return res.status(403).json({ message: "Not a doctor" });

    // Check if appointment exists
    const [appointment] = await pool.query(
      "SELECT doctor_id FROM appointments WHERE id = ?",
      [appointment_id]
    );

    if (!appointment.length)
      return res.status(404).json({ message: "Appointment not found" });

    // Ensure doctor is modifying only their own appointments
    if (appointment[0].doctor_id !== doctor.id)
      return res.status(403).json({ message: "Not your appointment" });

    // Insert or update prescription details into DB
    const [existingPrescriptionRows] = await pool.query(
      "SELECT * FROM prescriptions WHERE appointment_id = ?",
      [appointment_id]
    );

    if (existingPrescriptionRows && existingPrescriptionRows.length > 0) {
      // Update the existing prescription — prefer a single `notes`/`text` column if provided
      if (prescription_text !== undefined) {
        try {
          await pool.query(
            "UPDATE prescriptions SET notes = ?, diagnosis = ? WHERE appointment_id = ?",
            [prescription_text, diagnosis || null, appointment_id]
          );
        } catch (err) {
          // Fallback to legacy columns if `notes` doesn't exist
          if (err && err.code === "ER_BAD_FIELD_ERROR") {
            await pool.query(
              "UPDATE prescriptions SET medicine_name = ?, dosage = ? WHERE appointment_id = ?",
              [prescription_text, "", appointment_id]
            );
          } else {
            throw err;
          }
        }
      } else {
        await pool.query(
          "UPDATE prescriptions SET medicine_name = ?, dosage = ?, diagnosis = ? WHERE appointment_id = ?",
          [medicine_name, dosage, diagnosis || null, appointment_id]
        );
      }
    } else {
      // Insert a new prescription — prefer `notes` when provided
      if (prescription_text !== undefined) {
        try {
          await pool.query(
            "INSERT INTO prescriptions (appointment_id, notes, diagnosis) VALUES (?, ?, ?)",
            [appointment_id, prescription_text, diagnosis || null]
          );
        } catch (err) {
          // Fallback to legacy columns if `notes` doesn't exist
          if (err && err.code === "ER_BAD_FIELD_ERROR") {
            await pool.query(
              "INSERT INTO prescriptions (appointment_id, medicine_name, dosage) VALUES (?, ?, ?)",
              [appointment_id, prescription_text, ""]
            );
          } else {
            throw err;
          }
        }
      } else {
        await pool.query(
          "INSERT INTO prescriptions (appointment_id, medicine_name, dosage, diagnosis) VALUES (?, ?, ?, ?)",
          [appointment_id, medicine_name, dosage, diagnosis || null]
        );
      }
    }

    // Mark appointment as completed
    await pool.query(
      "UPDATE appointments SET status = 'COMPLETED' WHERE id = ?",
      [appointment_id]
    );

    res.status(201).json({ message: "Prescription added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add prescription" });
  }
};

/*
  Controller: getDoctorProfile()
  --------------------------------------------------
  - Fetches the profile of the logged-in doctor
  - Steps:
      1. Identify the doctor using req.user.id
      2. Fetch doctor details from the database
*/
const getDoctorProfile = async (req, res) => {
  const user_id = req.user.id; // Logged-in doctor’s user ID from token

  try {
    // Fetch doctor details including phone and address
    const [[doctor]] = await pool.query(
      `SELECT d.id, u.name, u.email, d.specialization, d.phone, d.address
       FROM doctors d
       JOIN users u ON d.user_id = u.id
       WHERE u.id = ?`,
      [user_id]
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor); // Send doctor profile back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctor profile" });
  }
};

/*
  Controller: updateDoctorProfile()
  --------------------------------------------------
  - Updates the profile of the logged-in doctor
  - Steps:
      1. Identify the doctor using req.user.id
      2. Validate the input data
      3. Update doctor details in the database
*/
const updateDoctorProfile = async (req, res) => {
  const user_id = req.user.id; // Logged-in doctor’s user ID from token
  const { name, specialization, phone, address } = req.body;

  try {
    console.log("Received data for update:", req.body); // Debugging log

    // Validate the user is a doctor
    const [[doctor]] = await pool.query(
      "SELECT id FROM doctors WHERE user_id = ?",
      [user_id]
    );

    if (!doctor) {
      console.log("Doctor not found for user_id:", user_id); // Debugging log
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update doctor details
    const [result] = await pool.query(
      `UPDATE doctors d
       JOIN users u ON d.user_id = u.id
       SET u.name = ?, d.specialization = ?, d.phone = ?, d.address = ?
       WHERE u.id = ?`,
      [name, specialization, phone || "", address || "", user_id]
    );

    console.log("Update result:", result); // Debugging log

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err); // Debugging log
    res.status(500).json({ message: "Failed to update doctor profile" });
  }
};

/*
  Controller: listDoctors()
  --------------------------------------------------
  - Returns list of doctors with id, name, email, and specialization
  - Accessible for patients/admin to enable booking and management
*/
const listDoctors = async (_req, res) => {
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

// Export doctor controllers for routes/doctorRoutes.js usage
module.exports = {
  getDoctorAppointments,
  addPrescription,
  listDoctors,
  getDoctorProfile,
  updateDoctorProfile,
};

/*
Query:
SELECT 
  a.id,
  a.date_time,
  a.status,
  u.name AS patient_name,
  u.email AS patient_email
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN users u ON p.user_id = u.id
WHERE a.doctor_id = ?
ORDER BY a.date_time ASC;

Notes:
1. Take appointments from the appointments table.
2. Use patient_id from appointments to match id in the patients table.
3. From patients table, get user_id that links to the users table.
4. From users table, fetch the patient’s name and email.
5. Only show appointments where doctor_id matches the logged-in doctor.
6. Sort results by date and time in ascending order.
*/
