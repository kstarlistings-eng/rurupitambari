import { cn } from "@/lib/utils";

const LoginLayout = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

LoginLayout.Container = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center p-0">
    <div className="w-full flex h-screen">{children}</div>
  </div>
);

LoginLayout.LeftSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("hidden lg:block w-1/3 relative h-full", className)}>
    {children}
  </div>
);

LoginLayout.RightContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex-1 flex items-center justify-center p-6", className)}>
    {children}
  </div>
);

LoginLayout.RightSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("w-full max-w-[440px]", className)}>{children}</div>;

export default LoginLayout;
