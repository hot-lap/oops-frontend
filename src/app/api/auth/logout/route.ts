import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SessionData, sessionOptions } from "@/lib/session";

const API_URL = process.env.API_URL || "https://api.oops.rest";

export async function POST() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );

  // 실제 API 로그아웃 호출 (실패 무시)
  if (session.accessToken) {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: { "X-OOPS-AUTH-TOKEN": session.accessToken },
      });
    } catch {
      // 무시
    }
  }

  // 세션 파기
  session.destroy();

  // 새 Guest 세션 생성
  const guestResponse = await fetch(
    `${API_URL}/api/v1/auth/guest-users/sign-up`,
    { method: "POST" },
  );

  if (!guestResponse.ok) {
    return NextResponse.json({ error: "Guest 재생성 실패" }, { status: 500 });
  }

  const guestData = await guestResponse.json();
  const { accessToken, userId } = guestData.data;

  // 새 세션 저장
  const newSession = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  newSession.accessToken = accessToken;
  newSession.userId = userId;
  newSession.userType = "guest";
  await newSession.save();

  return NextResponse.json({ userId, userType: "guest" });
}
