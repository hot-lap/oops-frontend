import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";

const API_URL = process.env.API_URL || "https://api.oops.rest";

/**
 * 서버 측 fetch 유틸리티
 * - 세션에서 토큰을 읽어 X-OOPS-AUTH-TOKEN 헤더 자동 첨부
 * - 401 응답 시 refreshToken으로 자동 갱신 후 재시도
 */
export async function serverFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  const headers = new Headers(init?.headers);
  if (session.accessToken) {
    headers.set("X-OOPS-AUTH-TOKEN", session.accessToken);
  }

  const url = `${API_URL}/${path}`;
  let response = await fetch(url, { ...init, headers });

  // 401 시 토큰 갱신 시도
  if (response.status === 401 && session.refreshToken) {
    const refreshResponse = await fetch(
      `${API_URL}/api/v1/auth/token/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      },
    );

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      const { accessToken, refreshToken } = refreshData.data;

      // 세션 업데이트
      session.accessToken = accessToken;
      session.refreshToken = refreshToken;
      await session.save();

      // 새 토큰으로 원래 요청 재시도
      headers.set("X-OOPS-AUTH-TOKEN", accessToken);
      response = await fetch(url, { ...init, headers });
    }
  }

  return response;
}
