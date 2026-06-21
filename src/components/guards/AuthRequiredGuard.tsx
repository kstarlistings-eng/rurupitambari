import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "@/store/auth-store";
import { Loader } from "lucide-react";

function AuthRequiredGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      if (!isAuthenticated) {
        await getUser(false);
      }
      if (mounted) setIsChecking(false);
    }
    check();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, getUser]);

  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return !isAuthenticated ? <Navigate to="/login" replace /> : children;
}

export default AuthRequiredGuard;
