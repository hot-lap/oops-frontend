/**
 * 토큰 관리 유틸리티
 *
 * 토큰 종류:
 * - Guest 토큰: 비로그인 사용자용, 서비스 체험 가능
 * - User 토큰: 로그인 사용자용, OAuth 인증 후 발급
 *
 * 토큰 전환 흐름:
 * 1. 최초 접속 → Guest 토큰 발급
 * 2. OAuth 로그인 → Guest 토큰 삭제 → User 토큰 저장
 * 3. 로그아웃 → User 토큰 삭제 → Guest 토큰 재발급
 */

const TOKEN_KEY = "oops_access_token";
const REFRESH_TOKEN_KEY = "oops_refresh_token";
const USER_TYPE_KEY = "oops_user_type";

export type UserType = "guest" | "user";

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  userType: UserType;
}

// ============================================
// 쿠키 유틸리티
// ============================================

function setCookie(
  key: string,
  value: string,
  days: number | "permanent" = 7,
): void {
  if (typeof window === "undefined") return;

  // permanent인 경우 10년으로 설정
  const expirationDays = days === "permanent" ? 365 * 10 : days;
  const expires = new Date(
    Date.now() + expirationDays * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${key}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(key: string): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieKey, cookieValue] = cookie.trim().split("=");
    if (cookieKey === key) {
      return cookieValue;
    }
  }
  return null;
}

function deleteCookie(key: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// ============================================
// 토큰 저장/조회/삭제
// ============================================

export function getAccessToken(): string | null {
  return getCookie(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY);
}

export function getUserType(): UserType | null {
  const type = getCookie(USER_TYPE_KEY);
  if (type === "guest" || type === "user") {
    return type;
  }
  return null;
}

export function isGuest(): boolean {
  return getUserType() === "guest";
}

export function isLoggedIn(): boolean {
  return getUserType() === "user";
}

export function hasToken(): boolean {
  return !!getAccessToken();
}

/**
 * 토큰 저장
 * - Guest: 영구 저장 (브라우저에 계속 유지)
 * - User: accessToken 90일, refreshToken 90일
 *
 * 서버 토큰 만료 시간:
 * - accessToken: 3시간
 * - refreshToken: 90일
 *
 * 참고: accessToken 쿠키를 90일로 설정하는 이유
 * - 현재 BE에서 토큰 갱신 시 accessToken + refreshToken 둘 다 필요
 * - 만료된 accessToken이라도 쿠키에 남아있어야 갱신 가능
 * - BE에서 refreshToken만으로 갱신 가능하도록 수정되면 3시간으로 변경 예정
 *
 * @see docs/AUTH.md - 토큰 갱신 관련 이슈
 * @see docs/BFF_ARCHITECTURE.md - 보안 강화 방안
 */
export function saveTokens(data: TokenData): void {
  const isGuestUser = data.userType === "guest";
  const expiration = isGuestUser ? "permanent" : 90;

  setCookie(TOKEN_KEY, data.accessToken, expiration);
  setCookie(USER_TYPE_KEY, data.userType, expiration);

  if (data.refreshToken) {
    setCookie(REFRESH_TOKEN_KEY, data.refreshToken, 90);
  }
}

/**
 * Guest 토큰 저장
 */
export function saveGuestToken(accessToken: string): void {
  saveTokens({
    accessToken,
    userType: "guest",
  });
}

/**
 * User 토큰 저장 (OAuth 로그인 성공 시)
 */
export function saveUserTokens(
  accessToken: string,
  refreshToken: string,
): void {
  saveTokens({
    accessToken,
    refreshToken,
    userType: "user",
  });
}

/**
 * 모든 토큰 삭제
 */
export function clearTokens(): void {
  deleteCookie(TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  deleteCookie(USER_TYPE_KEY);
}

/**
 * Access 토큰만 업데이트 (토큰 갱신 시)
 * - Guest: 영구 저장
 * - User: 90일
 */
export function updateAccessToken(accessToken: string): void {
  const expiration = isGuest() ? "permanent" : 90;
  setCookie(TOKEN_KEY, accessToken, expiration);
}
