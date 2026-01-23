import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api/posts";
import type {
  OAuthSignupResponse,
  OAuthCheckResponse,
} from "@/types/api/oauth";

type Provider = "google" | "kakao";

/**
 * OAuth 가입 여부 확인
 * @param provider OAuth 제공자 (google, kakao)
 * @param authorizationCode 인가 코드
 * @returns 가입 여부 (isExists: true면 기존 회원)
 */
export async function checkOAuthSignup(
  provider: Provider,
  authorizationCode: string,
): Promise<OAuthCheckResponse> {
  const response = await apiClient.get<ApiResponse<OAuthCheckResponse>>(
    `/api/v1/oauth/${provider}/signup/check`,
    { authorizationCode },
  );
  return response.data;
}

/**
 * OAuth 회원가입
 * @param provider OAuth 제공자 (google, kakao)
 * @param authorizationCode 인가 코드
 * @returns userId와 토큰 정보
 */
export async function oauthSignup(
  provider: Provider,
  authorizationCode: string,
): Promise<OAuthSignupResponse> {
  const response = await apiClient.post<ApiResponse<OAuthSignupResponse>>(
    `/api/v1/oauth/${provider}/signup`,
    { authorizationCode },
  );
  return response.data;
}
