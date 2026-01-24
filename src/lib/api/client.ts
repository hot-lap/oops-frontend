import { getAccessToken } from "@/lib/auth/token";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oops.rest";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

interface ApiErrorResponse {
  errorCode?: string;
  reason?: string;
  debug?: string;
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
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(),
        ...fetchOptions.headers,
      },
    });

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
