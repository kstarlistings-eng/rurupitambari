import { pool } from "../../config/db.js";
import { verifyPassword } from "../../utils/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import type { UserPayload } from "../../utils/jwt.js";

export interface LoginInput {
  email: string;
  password: string;
}

export async function login(input: LoginInput) {
  const result = await pool.query(
    "SELECT id, email, first_name, last_name, role, password_hash, is_active FROM users WHERE email = $1",
    [input.email]
  );

  const user = result.rows[0];
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  const valid = await verifyPassword(input.password, user.password_hash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const payload: UserPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    access_token: signAccessToken(payload),
    refresh_token: signRefreshToken(payload),
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    },
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const result = await pool.query(
    "SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1",
    [payload.userId]
  );
  const user = result.rows[0];
  if (!user || !user.is_active) {
    throw new Error("User not found or inactive");
  }

  return {
    access_token: signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    }),
  };
}

export async function getMe(userId: string) {
  const result = await pool.query(
    "SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1",
    [userId]
  );
  const user = result.rows[0];
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
