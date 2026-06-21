import type { User } from "./user";

type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refreshTokenPromise: Promise<string | null> | null;
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
  refreshTokenFn: () => Promise<string | null>;
}
