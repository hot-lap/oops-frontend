/**
 * Google OAuth 관련 유틸리티
 */

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

/**
 * Google OAuth 인가 URL 생성
 * @returns Google OAuth 로그인 페이지 URL
 */
export function getGoogleOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("Google OAuth 환경 변수가 설정되지 않았습니다.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Google OAuth 로그인 페이지로 리다이렉트
 */
export function redirectToGoogleOAuth(): void {
  const url = getGoogleOAuthUrl();
  window.location.href = url;
}
