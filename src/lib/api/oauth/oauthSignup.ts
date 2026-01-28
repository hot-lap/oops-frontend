import { apiClient, type ApiResponse } from "../client";

type Provider = "google" | "kakao";

export interface OAuthSignupResponse {
  userId: number;
  tokens: {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  };
}

/**
 * OAuth 회원가입
 * @param provider OAuth 제공자 (google, kakao)
 * @param authorizationCode 인가 코드
 * @param redirectUri 리다이렉트 URI (FE에서 사용한 것과 동일해야 함)
 * @returns userId와 토큰 정보
 */
export async function oauthSignup(
  provider: Provider,
  authorizationCode: string,
  redirectUri: string,
): Promise<OAuthSignupResponse> {
  const response = await apiClient
    .post(`api/v1/oauth/${provider}/signup`, {
      json: { authorizationCode, redirectUri },
    })
    .json<ApiResponse<OAuthSignupResponse>>();

  return response.data;
}
