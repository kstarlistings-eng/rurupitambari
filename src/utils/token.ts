import { baseURL } from "@/config/axios-interceptor";
import {
  ACCESS_TOKEN_CONSTANT,
  REFRESH_TOKEN_CONSTANT,
} from "@/config/constants";
import { jwtDecode } from "jwt-decode";

export const getToken = (key: string): string | undefined => {
  return localStorage.get(key);
};

export const createToken = (key: string, value: string): void => {
  localStorage.set(key, value);
};

export const deleteToken = (key: string): void => {
  localStorage.removeItem(key);
};

export const verifyRefreshToken = async () => {
  // 2️⃣ Call refresh API
  const response = await fetch(baseURL + "/refresh-token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: getToken(REFRESH_TOKEN_CONSTANT),
    }),
  });

  const data = await response.json();
  if (response.ok) {
    return data.access;
  }

  throw new Error(data.detail || "Failed to refresh token");
};

export const isTokenExpiredClient = (token?: string): boolean => {
  if (!token) return true;

  try {
    const payload: { exp?: number } = jwtDecode(token);

    if (!payload?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
};

export const logoutClient = () => {
  deleteToken(ACCESS_TOKEN_CONSTANT);
  deleteToken(REFRESH_TOKEN_CONSTANT);
};
