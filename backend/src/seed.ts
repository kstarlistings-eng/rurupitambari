import "dotenv/config";
import { pool } from "./config/db.js";
import { hashPassword } from "./utils/password.js";

async function seed() {
  const users = [
    {
      email: "admin@pitambari.com",
      password: "admin123",
      first_name: "Admin",
      last_name: "Finance",
      role: "admin_finance",
    },
    {
      email: "production@pitambari.com",
      password: "production123",
      first_name: "Production",
      last_name: "Operator",
      role: "production_operator",
    },
    {
      email: "store@pitambari.com",
      password: "store123",
      first_name: "Store",
      last_name: "Operator",
      role: "store_operator",
    },
  ];

  for (const user of users) {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      user.email,
    ]);
    if (existing.rows.length > 0) {
      console.log(`User ${user.email} already exists, skipping.`);
      continue;
    }

    const passwordHash = await hashPassword(user.password);
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.email, passwordHash, user.first_name, user.last_name, user.role]
    );
    console.log(`Created user ${user.email} with role ${user.role}`);
  }

  await pool.end();
  console.log("Seeding complete.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
