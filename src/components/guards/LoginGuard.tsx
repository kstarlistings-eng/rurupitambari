import { useAuthStore } from "@/store/auth-store";
import { Navigate } from "react-router";
import { getHomePath } from "@/lib/role-utils";

type Props = { children: React.ReactNode };

function LoginGuard({ children }: Props) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <>{children}</>;
  return <Navigate to={getHomePath(user?.role)} replace />;
}

export default LoginGuard;
