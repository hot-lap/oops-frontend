import ky from "ky";

interface MeResponse {
  userId: number | null;
  userType: "guest" | "user" | null;
}

/**
 * 세션 기반 유저 정보 조회 (BFF 경유)
 * @returns 유효하면 사용자 정보, 유효하지 않으면 null
 */
export async function getMyInfo(): Promise<{
  userId: number;
  userType: "guest" | "user";
} | null> {
  try {
    const data = await ky.get("/api/auth/me").json<MeResponse>();

    if (data.userId && data.userType) {
      return { userId: data.userId, userType: data.userType };
    }
    return null;
  } catch {
    return null;
  }
}
