import ky from "ky";

type Provider = "google" | "kakao";

export interface OAuthSignupResponse {
  userId: number;
  userType: "user";
}

/**
 * OAuth 회원가입 (BFF 경유)
 */
export async function oauthSignup(
  provider: Provider,
  authorizationCode: string,
  redirectUri: string,
): Promise<OAuthSignupResponse> {
  return ky
    .post(`/api/auth/oauth/${provider}`, {
      json: { authorizationCode, redirectUri },
    })
    .json<OAuthSignupResponse>();
}
