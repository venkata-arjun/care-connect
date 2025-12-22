// Import Express to create route handlers
const express = require("express");

// Create a router instance to group related authentication routes
const router = express.Router();

// Import controller functions that handle signup and login logic
const { signup, login } = require("../controllers/authController");

/*
  Route: POST /signup
  - Calls signup controller
  - Used for registering a new user (doctor or patient)
*/
router.post("/signup", signup);

/*
  Route: POST /login
  - Calls login controller
  - Used to authenticate user and return JWT token
*/
router.post("/login", login);

// Export router so the main server file can mount it under /auth
module.exports = router;
