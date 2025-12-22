// Import Express to create a router
const express = require("express");
const router = express.Router();

// Import auth middleware to protect admin-only routes
const { auth } = require("../middleware/authMiddleware");

// Import admin controller functions
const {
  addDoctor,
  getStats,
  getDoctors,
  getPatients,
  getRecentAppointments,
} = require("../controllers/adminController");

/*
  POST /admin/doctor
  - Only ADMIN can add a doctor account
*/
router.post("/doctor", auth("ADMIN"), addDoctor);

/*
  GET /admin/stats
  - Only ADMIN can view system statistics
*/
router.get("/stats", auth("ADMIN"), getStats);

/*
  GET /admin/doctors
  - List all doctors
*/
router.get("/doctors", auth("ADMIN"), getDoctors);

/*
  GET /admin/patients
  - List all patients
*/
router.get("/patients", auth("ADMIN"), getPatients);

/*
  GET /admin/activity
  - Recent appointments/activity feed
*/
router.get("/activity", auth("ADMIN"), getRecentAppointments);

// Export router for use in main server
module.exports = router;

/*
Why Admin Only Adds Doctors:

1. Doctors must be verified before gaining access.
2. Prevents normal users from pretending to be doctors.
3. Stops unauthorized access to patient medical data.
4. Maintains security, privacy, and trust in the system.
5. Patients can self-register, but doctors require admin approval.

Summary: Admin controls who becomes a doctor to ensure only authorized,
qualified medical professionals have doctor privileges.
*/
