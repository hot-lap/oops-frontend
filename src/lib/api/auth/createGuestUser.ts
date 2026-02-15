import ky from "ky";

interface GuestResponse {
  userId: number;
  userType: "guest";
}

/**
 * Guest 유저 생성 (BFF 경유)
 */
export async function createGuestUser(): Promise<GuestResponse> {
  return ky.post("/api/auth/guest").json<GuestResponse>();
}
