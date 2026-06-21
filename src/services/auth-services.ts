import { baseInstance } from "@/config/axios-interceptor";
import {
  ACCESS_TOKEN_CONSTANT,
  REFRESH_TOKEN_CONSTANT,
} from "@/config/constants";
import { createToken } from "@/utils/token";

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export async function loginService(loginInput: LoginInput) {
  const data = await baseInstance.post<LoginResponse>("/auth/login", loginInput);
  createToken(ACCESS_TOKEN_CONSTANT, data.access_token);
  createToken(REFRESH_TOKEN_CONSTANT, data.refresh_token);
  return data;
}

export async function getMeService() {
  return await baseInstance.get<{
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
  }>("/auth/me");
}
