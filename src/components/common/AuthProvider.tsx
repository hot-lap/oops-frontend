"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 앱 초기화 시 인증 상태를 설정하는 Provider
 *
 * - 기존 토큰이 있으면 상태 복원
 * - 토큰이 없으면 Guest 토큰 자동 발급
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isInitialized, isLoading, error } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // 초기화 중일 때 로딩 UI 표시
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 초기화 실패 시 에러 UI 표시
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-500">앱을 시작할 수 없습니다.</p>
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          새로고침
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
