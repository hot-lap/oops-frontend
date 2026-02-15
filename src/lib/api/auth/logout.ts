import ky from "ky";

interface LogoutResponse {
  userId: number;
  userType: "guest";
}

/**
 * 로그아웃 (BFF 경유)
 * - 서버에서 로그아웃 처리 후 Guest 세션 재생성
 */
export async function logout(): Promise<LogoutResponse> {
  return ky.post("/api/auth/logout").json<LogoutResponse>();
}
