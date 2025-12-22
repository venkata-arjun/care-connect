// One-off script to create/reset an Admin account
// Usage:
//  - Set env ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME (optional)
//  - Or pass CLI args: node scripts/createAdmin.js email password [name]
//  - Requires DB env vars (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) and JWT not needed

require("dotenv").config();
const pool = require("../config/db");
const { hashPassword } = require("../utils/password");

(async function main() {
  try {
    const email = process.argv[2] || process.env.ADMIN_EMAIL;
    const password = process.argv[3] || process.env.ADMIN_PASSWORD;
    const name = process.argv[4] || process.env.ADMIN_NAME || "Administrator";

    if (!email || !password) {
      console.error("Provide ADMIN_EMAIL and ADMIN_PASSWORD via env or CLI");
      process.exit(1);
    }

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND role = "ADMIN"',
      [email]
    );

    if (existing.length > 0) {
      // Update password for existing admin
      const password_hash = await hashPassword(password);
      await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [
        password_hash,
        existing[0].id,
      ]);
      console.log(`Updated admin password for ${email}`);
    } else {
      // Create new admin user
      const password_hash = await hashPassword(password);
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, "ADMIN")',
        [name, email, password_hash]
      );
      console.log(`Created admin user ${email}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
