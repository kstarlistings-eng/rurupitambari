import type { User } from "./user";

export interface TokenResponse {
  access: string;
  refresh: string;
  user: User;
}
