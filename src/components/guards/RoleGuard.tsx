import { Navigate } from "react-router";
import { useAuthStore } from "@/store/auth-store";

type Props = {
  allowedRoles: string[];
  getFallbackPath?: (role: string) => string;
  children: React.ReactNode;
};

function RoleGuard({ allowedRoles, getFallbackPath, children }: Props) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const fallback = getFallbackPath ? getFallbackPath(user.role) : "/login";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}

export default RoleGuard;
