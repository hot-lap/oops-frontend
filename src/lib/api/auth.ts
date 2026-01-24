/**
 * 인증 관련 API 함수
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oops.rest";

// ============================================
// 타입 정의
// ============================================

interface GuestSignUpResponse {
  data: {
    accessToken: string;
    userId: number;
  };
}

interface TokenRefreshRequest {
  accessToken: string;
  refreshToken: string;
}

interface TokenRefreshResponse {
  data: {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  };
}

// ============================================
// API 함수
// ============================================

/**
 * Guest 유저 생성 및 토큰 발급
 */
export async function createGuestUser(): Promise<{
  accessToken: string;
  userId: number;
}> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/guest-users/sign-up`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(`Guest 토큰 발급 실패: ${response.status}`);
  }

  const data: GuestSignUpResponse = await response.json();
  return data.data;
}

/**
 * 토큰 갱신
 */
export async function refreshTokens(
  accessToken: string,
  refreshToken: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accessToken,
      refreshToken,
    } satisfies TokenRefreshRequest),
  });

  if (!response.ok) {
    throw new Error(`토큰 갱신 실패: ${response.status}`);
  }

  const data: TokenRefreshResponse = await response.json();
  return {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
}

// ============================================
// 사용자 정보 타입
// ============================================

interface MyInfoResponse {
  id: number;
  name: string | null;
  nickname: string | null;
  guest: boolean;
}

/**
 * 토큰 유효성 검증 (사용자 정보 조회)
 * @returns 유효하면 사용자 정보, 유효하지 않으면 null
 */
export async function getMyInfo(accessToken: string): Promise<{
  userId: number;
  isGuest: boolean;
} | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/my-info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-OOPS-AUTH-TOKEN": accessToken,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: MyInfoResponse = await response.json();
    return {
      userId: data.id,
      isGuest: data.guest,
    };
  } catch {
    return null;
  }
}

/**
 * 로그아웃
 */
export async function logout(accessToken: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-OOPS-AUTH-TOKEN": accessToken,
    },
  });
  // 로그아웃은 실패해도 클라이언트 토큰은 삭제
}
