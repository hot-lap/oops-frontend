import ky from "ky";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oops.rest";

interface GuestSignUpResponse {
  data: {
    accessToken: string;
    userId: number;
  };
}

/**
 * Guest 유저 생성 및 토큰 발급
 */
export async function createGuestUser(): Promise<{
  accessToken: string;
  userId: number;
}> {
  const response = await ky
    .post(`${API_BASE_URL}/api/v1/auth/guest-users/sign-up`)
    .json<GuestSignUpResponse>();

  return response.data;
}
