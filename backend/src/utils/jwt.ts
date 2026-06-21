import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type UserPayload = {
  userId: string;
  email: string;
  role: string;
};

export function signAccessToken(payload: UserPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(payload: UserPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyAccessToken(token: string): UserPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as UserPayload;
}

export function verifyRefreshToken(token: string): UserPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as UserPayload;
}
