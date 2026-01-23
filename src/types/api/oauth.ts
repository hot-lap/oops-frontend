// OAuth 토큰 컨텍스트
export interface OAuthTokenContext {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

// OAuth 회원가입 응답
export interface OAuthSignupResponse {
  userId: number;
  tokens: OAuthTokenContext;
}

// OAuth 가입 여부 확인 응답
export interface OAuthCheckResponse {
  isExists: boolean;
}
