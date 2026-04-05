import type { TokenResponse } from "./token";
import type { User } from "./user";

type LoginInput = any;

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refreshTokenPromise: Promise<TokenResponse> | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Methods
  getMe: () => Promise<User>;
  login: (loginInput: LoginInput) => Promise<User>;
  logout: () => void;
  clear: () => void;
  getUser: (isLoading?: boolean) => Promise<boolean>;
  clearError: () => void;
  checkAuth: () => boolean;
  refreshTokenFn: () => Promise<TokenResponse | null>;
}
