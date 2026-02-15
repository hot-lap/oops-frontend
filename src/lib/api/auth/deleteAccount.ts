import ky from "ky";

interface DeleteAccountResponse {
  userId: number;
  userType: "guest";
}

/**
 * 회원 탈퇴 (BFF 경유)
 * - 서버에서 탈퇴 처리 후 Guest 세션 재생성
 */
export async function deleteAccount(): Promise<DeleteAccountResponse> {
  return ky.delete("/api/auth/delete-account").json<DeleteAccountResponse>();
}
