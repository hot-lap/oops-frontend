"use client";

import { Component, Suspense, type ReactNode, type ErrorInfo } from "react";

// ============================================
// ErrorBoundary (클래스 컴포넌트 - React 요구사항)
// ============================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (props: { error: Error; reset: () => void }) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        reset: this.reset,
      });
    }
    return this.props.children;
  }
}

// ============================================
// AsyncBoundary (Suspense + ErrorBoundary 결합)
// ============================================

interface AsyncBoundaryProps {
  children: ReactNode;
  pendingFallback?: ReactNode;
  rejectedFallback?: (props: { error: Error; reset: () => void }) => ReactNode;
}

// 기본 로딩 UI
function DefaultPendingFallback() {
  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
    </div>
  );
}

// 기본 에러 UI
function DefaultRejectedFallback({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
      <p className="text-gray-500">문제가 발생했습니다.</p>
      <button
        onClick={reset}
        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        다시 시도
      </button>
    </div>
  );
}

/**
 * Suspense + ErrorBoundary를 결합한 비동기 경계 컴포넌트
 *
 * @example
 * ```tsx
 * <AsyncBoundary>
 *   <PostList />
 * </AsyncBoundary>
 *
 * // 커스텀 fallback 사용
 * <AsyncBoundary
 *   pendingFallback={<CustomLoading />}
 *   rejectedFallback={({ reset }) => <CustomError onRetry={reset} />}
 * >
 *   <PostList />
 * </AsyncBoundary>
 * ```
 */
export function AsyncBoundary({
  children,
  pendingFallback = <DefaultPendingFallback />,
  rejectedFallback = DefaultRejectedFallback,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary fallback={rejectedFallback}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// ErrorBoundary도 개별 export (필요시 사용)
export { ErrorBoundary };
