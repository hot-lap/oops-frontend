import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SessionData, sessionOptions } from "@/lib/session";

const API_URL = process.env.API_URL || "https://api.oops.rest";

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  const accessToken = session.accessToken;
  if (!accessToken) {
    return NextResponse.json({ userId: null, userType: null });
  }

  // accessToken으로 유저 정보 조회
  let response = await fetch(`${API_URL}/api/v1/my-info`, {
    headers: { "X-OOPS-AUTH-TOKEN": accessToken },
  });

  // 만료 시 refreshToken으로 갱신
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
      const newAccessToken: string = refreshData.data.accessToken;
      session.accessToken = newAccessToken;
      session.refreshToken = refreshData.data.refreshToken;
      await session.save();

      response = await fetch(`${API_URL}/api/v1/my-info`, {
        headers: { "X-OOPS-AUTH-TOKEN": newAccessToken },
      });
    }
  }

  if (!response.ok) {
    // 모두 실패 시 세션 파기
    session.destroy();
    return NextResponse.json({ userId: null, userType: null });
  }

  const data = await response.json();
  return NextResponse.json({
    userId: data.data.id,
    userType: session.userType ?? (data.data.isGuest ? "guest" : "user"),
  });
}
