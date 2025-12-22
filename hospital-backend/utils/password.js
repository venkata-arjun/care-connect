// Import bcrypt for hashing and verifying passwords securely
const bcrypt = require("bcrypt");

/*
  hashPassword()
  - Takes a plain text password
  - Generates a random salt (adds extra security)
  - Returns the hashed password
  - The number 10 defines the salt complexity (balanced speed + security)
*/
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/*
  comparePassword()
  - Compares a plain text password with the stored hashed password
  - Returns true if they match, false if not
  - Used during login to validate credentials
*/
const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

// Export both helpers so they can be used in controllers
module.exports = { hashPassword, comparePassword };
