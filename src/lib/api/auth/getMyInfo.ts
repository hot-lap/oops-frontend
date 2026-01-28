import ky from "ky";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oops.rest";

interface MyInfoResponse {
  data: {
    id: number;
    name: string | null;
    nickname: string | null;
    isGuest: boolean;
  };
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
    const response = await ky
      .get(`${API_BASE_URL}/api/v1/my-info`, {
        headers: {
          "X-OOPS-AUTH-TOKEN": accessToken,
        },
      })
      .json<MyInfoResponse>();

    return {
      userId: response.data.id,
      isGuest: response.data.isGuest,
    };
  } catch {
    return null;
  }
}
