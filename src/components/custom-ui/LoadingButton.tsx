import { Loader } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loadingClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

function LoadingButton({
  isLoading = false,
  loadingText = "Loading...",
  children,
  onClick,
  icon,
  iconPosition = "left",
  disabled = false,
  ...props
}: LoadingButtonProps) {
  const isDisabled = isLoading || disabled;

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
      className={cn(
        "flex gap-1",
        props.className,
        isDisabled && "cursor-not-allowed",
        iconPosition === "right" && "flex-row-reverse"
      )}
    >
      {isLoading && (
        <Loader
          className={cn("animate-spin", props.loadingClassName)}
          size={16}
          aria-hidden="true"
        />
      )}
      {icon && !isLoading && <>{icon}</>}
      <span>{isLoading ? loadingText : children}</span>
    </Button>
  );
}

export default LoadingButton;
