import {
  getAccessToken,
  getRefreshToken,
  saveUserTokens,
  clearTokens,
  getUserType,
} from "@/lib/auth/token";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oops.rest";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  skipAuthRefresh?: boolean; // 토큰 갱신 재시도 방지용
}

interface ApiErrorResponse {
  errorCode?: string;
  reason?: string;
  debug?: string;
}

// 토큰 갱신 중복 요청 방지
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * 토큰 갱신 (API 클라이언트 내부용)
 */
async function refreshTokensInternal(): Promise<boolean> {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
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

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = getAccessToken();
    if (token) {
      headers["X-OOPS-AUTH-TOKEN"] = token;
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, skipAuthRefresh, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(),
        ...fetchOptions.headers,
      },
    });

    // 401 에러 시 토큰 갱신 시도 (User만, 재시도 아닌 경우만)
    if (
      response.status === 401 &&
      !skipAuthRefresh &&
      getUserType() === "user"
    ) {
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
        return this.request<T>(endpoint, { ...options, skipAuthRefresh: true });
      } else {
        // 토큰 갱신 실패 - 토큰 삭제 (로그인 페이지로 유도)
        clearTokens();
        if (typeof window !== "undefined") {
          toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
          // 페이지 새로고침으로 Guest 토큰 재발급 유도
          window.location.reload();
        }
      }
    }

    if (!response.ok) {
      let errorResponse: ApiErrorResponse | null = null;
      try {
        errorResponse = await response.json();
      } catch {
        // JSON 파싱 실패 시 무시
      }

      const errorMessage =
        errorResponse?.reason || "요청을 처리하는 중 오류가 발생했습니다.";

      // 클라이언트 환경에서만 toast 표시
      if (typeof window !== "undefined") {
        toast.error(errorMessage);
      }

      throw new ApiError(response.status, errorMessage, url, errorResponse);
    }

    // 204 No Content인 경우 빈 객체 반환
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export class ApiError extends Error {
  status: number;
  url: string;
  errorResponse: ApiErrorResponse | null;

  constructor(
    status: number,
    message: string,
    url: string = "",
    errorResponse: ApiErrorResponse | null = null,
  ) {
    super(message);
    this.status = status;
    this.url = url;
    this.errorResponse = errorResponse;
    this.name = "ApiError";
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
