import ky from "ky";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oops.rest";

/**
 * 로그아웃
 */
export async function logout(accessToken: string): Promise<void> {
  try {
    await ky.post(`${API_BASE_URL}/api/v1/auth/logout`, {
      headers: {
        "X-OOPS-AUTH-TOKEN": accessToken,
      },
    });
  } catch {
    // 로그아웃은 실패해도 클라이언트 토큰은 삭제
  }
}
