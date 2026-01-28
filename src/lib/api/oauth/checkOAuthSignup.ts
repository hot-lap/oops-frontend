import { apiClient, type ApiResponse } from "../client";

type Provider = "google" | "kakao";

export interface OAuthCheckResponse {
  isExists: boolean;
}

/**
 * OAuth 가입 여부 확인
 * @param provider OAuth 제공자 (google, kakao)
 * @param authorizationCode 인가 코드
 * @param redirectUri 리다이렉트 URI (FE에서 사용한 것과 동일해야 함)
 * @returns 가입 여부 (isExists: true면 기존 회원)
 */
export async function checkOAuthSignup(
  provider: Provider,
  authorizationCode: string,
  redirectUri: string,
): Promise<OAuthCheckResponse> {
  const response = await apiClient
    .get(`api/v1/oauth/${provider}/signup/check`, {
      searchParams: { authorizationCode, redirectUri },
    })
    .json<ApiResponse<OAuthCheckResponse>>();

  return response.data;
}
