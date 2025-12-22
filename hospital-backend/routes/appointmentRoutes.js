// Import Express to create route handlers
const express = require("express");

// Create a router instance to group appointment-related routes
const router = express.Router();

// Import auth middleware to ensure only logged-in users access these routes
const { auth } = require("../middleware/authMiddleware");

// Import appointment controller functions
// - bookAppointment: Patient books an appointment
// - getMyAppointments: Patient views their booked appointments
// - updatePatientProfile: Patient updates their profile info
// - getPatientProfile: Get current patient's profile data
const {
  bookAppointment,
  getMyAppointments,
  updatePatientProfile,
  getPatientProfile,
} = require("../controllers/appointmentController");

/*
  Route: POST /appointments/
  - Requires authentication with role "PATIENT"
  - Calls bookAppointment controller to create a new appointment
*/
router.post("/", auth("PATIENT"), bookAppointment);

/*
  Route: GET /appointments/my
  - Requires authentication with role "PATIENT"
  - Returns the logged-in patient's appointments list
*/
router.get("/my", auth("PATIENT"), getMyAppointments);

/*
  Route: PUT /appointments/profile
  - Requires authentication with role "PATIENT"
  - Updates the patient's profile information
*/
router.put("/profile", auth("PATIENT"), updatePatientProfile);

/*
  Route: GET /appointments/profile
  - Requires authentication with role "PATIENT"
  - Returns the logged-in patient's profile data (name, email, phone)
*/
router.get("/profile", auth("PATIENT"), getPatientProfile);

// Export router for main server usage under /appointments
module.exports = router;

/*
Short Notes:
1. router.post("/", auth("PATIENT"), bookAppointment);
2. router.get("/my", auth("PATIENT"), getMyAppointments);

- auth("PATIENT") runs first in both cases:

1. Checks if the user is logged in with a valid JWT token
2. Checks if the user’s role is **PATIENT**
3. If valid, `req.user` becomes available to the controller
4. If not valid → request is blocked

Both routes require the user to be **an authenticated patient**, or the request is immediately rejected.

*/
