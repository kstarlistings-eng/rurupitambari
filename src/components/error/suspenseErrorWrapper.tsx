import React, { Suspense } from "react";
import ErrorBoundary from "./errorBoundary";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorLayout?: React.ReactNode;
};

function SuspenseErrorWrapper({ children, fallback, errorLayout }: Props) {
  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary errorLayout={errorLayout}>{children}</ErrorBoundary>
    </Suspense>
  );
}

export default SuspenseErrorWrapper;
