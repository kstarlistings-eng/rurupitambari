import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function Page({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-[24px] w-full", className)}>
      {children}
    </div>
  );
}

Page.FormContainer = function PageFormContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("max-w-[1200px] w-full mx-auto py-0 sm:py-5", className)}
    >
      {children}
    </div>
  );
};

Page.Header = function PageHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center flex-wrap justify-between w-full gap-y-5",
        className,
      )}
    >
      {children}
    </div>
  );
};

Page.HeaderLeftContainer = function PageHeaderLeftContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>{children}</div>
  );
};

Page.Back = function PageBack({
  className,
  onClick,
  backUrl,
}: {
  className?: string;
  onClick?: () => void;
  backUrl?: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      className={cn(
        "w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 shrink-0 bg-white transition-colors text-neutral-500 cursor-pointer",
        className,
      )}
      onClick={onClick || (() => (backUrl ? navigate(backUrl) : navigate(-1)))}
    >
      <ArrowLeft size={16} />
    </button>
  );
};

Page.HeaderContent = function PageHeaderContent({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
};

Page.HeaderTitle = function PageHeaderTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-2xl font-semibold text-black tracking-[-0.48px]",
        className,
      )}
    >
      {children}
    </h2>
  );
};

Page.HeaderDescription = function PageHeaderDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-[16px] text-neutral-400 font-normal", className)}>
      {children}
    </p>
  );
};

Page.PageHeaderRightContainer = function PageHeaderRightContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>{children}</div>
  );
};

Page.Content = function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full", className)}>{children}</div>;
};
