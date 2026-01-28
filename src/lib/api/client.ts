import ky, { type KyInstance, type Options } from "ky";
import {
  getAccessToken,
  getRefreshToken,
  saveUserTokens,
  clearTokens,
  getUserType,
} from "@/lib/auth/token";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oops.rest";

// 토큰 갱신 중복 요청 방지
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * 토큰 갱신 (API 클라이언트 내부용)
 * - refreshToken만으로 갱신 가능
 * - Refresh Token Rotation: 새 refreshToken도 저장
 */
async function refreshTokensInternal(): Promise<boolean> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    saveUserTokens(data.data.accessToken, data.data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

/**
 * ky 기반 API 클라이언트
 */
export const apiClient: KyInstance = ky.create({
  prefixUrl: API_BASE_URL,
  retry: 0,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAccessToken();
        if (token) {
          request.headers.set("X-OOPS-AUTH-TOKEN", token);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // 401 에러 시 토큰 갱신 시도 (User만)
        if (response.status === 401 && getUserType() === "user") {
          // 이미 재시도한 요청인지 확인
          if ((options as Options & { _retried?: boolean })._retried) {
            return response;
          }

          // 중복 갱신 요청 방지
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshTokensInternal();
          }

          const refreshSuccess = await refreshPromise;
          isRefreshing = false;
          refreshPromise = null;

          if (refreshSuccess) {
            // 토큰 갱신 성공 - 원래 요청 재시도
            return ky(request, {
              ...options,
              _retried: true,
            } as Options);
          } else {
            // 토큰 갱신 실패 - 토큰 삭제
            clearTokens();
            if (typeof window !== "undefined") {
              toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
              window.location.reload();
            }
          }
        }

        return response;
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;
        if (response) {
          try {
            const body = await response.json();
            const errorMessage =
              (body as { reason?: string }).reason ||
              "요청을 처리하는 중 오류가 발생했습니다.";

            if (typeof window !== "undefined") {
              toast.error(errorMessage);
            }

            error.message = errorMessage;
          } catch {
            // JSON 파싱 실패 시 기본 에러 메시지 사용
          }
        }
        return error;
      },
    ],
  },
});

/**
 * API 응답 타입 (data wrapper)
 */
export interface ApiResponse<T> {
  data: T;
}
