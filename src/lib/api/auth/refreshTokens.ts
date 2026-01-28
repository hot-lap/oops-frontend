import ky from "ky";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.oops.rest";

interface TokenRefreshResponse {
  data: {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  };
}

/**
 * 토큰 갱신
 * - refreshToken만으로 갱신 가능
 * - Refresh Token Rotation: 새 refreshToken도 발급
 */
export async function refreshTokens(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const response = await ky
    .post(`${API_BASE_URL}/api/v1/auth/token/refresh`, {
      json: { refreshToken },
    })
    .json<TokenRefreshResponse>();

  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  };
}
