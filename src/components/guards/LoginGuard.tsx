import { useAuthStore } from "@/store/auth-store";
import { Navigate } from "react-router";

type Props = { children: React.ReactNode };

function LoginGuard({ children }: Props) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default LoginGuard;
