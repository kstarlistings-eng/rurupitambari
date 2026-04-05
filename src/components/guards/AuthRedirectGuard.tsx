import { Navigate } from "react-router";
import { useAuthStore } from "@/store/auth-store";

type Props = {
  children: React.ReactNode;
};

function AuthRedirectGuard({ children }: Props) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? <Navigate to="/login" replace /> : children;
}

export default AuthRedirectGuard;
