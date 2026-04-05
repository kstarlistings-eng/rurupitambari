import React, { type ReactNode } from "react";
import ErrorLayout from "./errorLayout";

interface ErrorBoundaryProps {
  children: ReactNode;
  errorLayout?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(): void {}

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.errorLayout || <ErrorLayout />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
