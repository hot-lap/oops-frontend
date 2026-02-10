import { apiClient } from "../client";

/**
 * 회원 탈퇴 (내 정보 삭제)
 */
export async function deleteAccount(): Promise<void> {
  await apiClient.delete("api/v1/my-info");
}
