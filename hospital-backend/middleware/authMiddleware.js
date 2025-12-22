// Import JWT library to verify authentication tokens
const jwt = require("jsonwebtoken");

// Load environment variables (used for JWT secret key)
require("dotenv").config();

/*
  Middleware Factory: auth(roles)
  --------------------------------------------------
  - Protects routes by validating JWT tokens
  - Allows optional role-based authorization
  - roles can be:
      • A single role as a string → "ADMIN"
      • Multiple roles as array → ["ADMIN", "DOCTOR"]
*/
const auth = (roles = []) => {
  // Ensure roles is always an array (simplifies checks later)
  if (typeof roles === "string") {
    roles = [roles];
  }

  // Return actual middleware function
  return (req, res, next) => {
    // Tokens must be sent in Authorization header as: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    try {
      // Verify token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Save decoded user info in request object (id, role, email)
      req.user = decoded;

      // If route requires specific roles, check role access
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      // Allow request to go to the next handler
      next();
    } catch (err) {
      // Token invalid or expired
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// Export the middleware for route protection usage
module.exports = {
  auth,
};
