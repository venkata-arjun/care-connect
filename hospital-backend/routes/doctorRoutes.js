// Import Express to define API routes
const express = require("express");

// Create a router to group doctor-related routes
const router = express.Router();

// Import authentication middleware to protect doctor-specific endpoints
const { auth } = require("../middleware/authMiddleware");

// Import controller functions for doctors
// - getDoctorAppointments: doctor sees their appointments
// - addPrescription: doctor adds prescription for a patient
// - getDoctorProfile: doctor views their profile
const {
  getDoctorAppointments,
  addPrescription,
  listDoctors,
  getDoctorProfile,
  updateDoctorProfile,
} = require("../controllers/doctorController");

/*
  Route: GET /doctor/appointments
  - Only accessible by users with role "DOCTOR"
  - Returns all appointments for the logged-in doctor
*/
router.get("/appointments", auth("DOCTOR"), getDoctorAppointments);

/*
  Route: POST /doctor/prescription
  - Only accessible by users with role "DOCTOR"
  - Adds a prescription for one of the doctor's appointments
*/
router.post("/prescription", auth("DOCTOR"), addPrescription);

/*
  Route: GET /doctor/list
  - Accessible by PATIENT and ADMIN to view doctors
  - Used by patients to choose a doctor for booking
*/
router.get("/list", auth(["PATIENT", "ADMIN"]), listDoctors);

/*
  Route: GET /doctor/profile
  - Only accessible by users with role "DOCTOR"
  - Returns the profile of the logged-in doctor
*/
router.get("/profile", auth("DOCTOR"), getDoctorProfile);

/*
  Route: PUT /doctor/profile
  - Only accessible by users with role "DOCTOR"
  - Updates the profile of the logged-in doctor
*/
router.put("/profile", auth("DOCTOR"), updateDoctorProfile);

// Export routes for server usage under /doctor
module.exports = router;

/*
Short Notes:
1. router.get("/appointments", auth("DOCTOR"), getDoctorAppointments);
2. router.post("/prescription", auth("DOCTOR"), addPrescription);

- auth("DOCTOR") runs first in both cases:

1. Confirms the request has a valid JWT token (user must be logged in)
2. Verifies the logged-in user’s role is DOCTOR
3. If valid, req.user is attached with user details for controller use
4. If invalid → request is blocked before reaching the controller

Both routes allow access **only to authenticated doctors**.
Everyone else gets denied.
*/
