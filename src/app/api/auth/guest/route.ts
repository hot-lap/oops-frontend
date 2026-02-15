import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SessionData, sessionOptions } from "@/lib/session";

const API_URL = process.env.API_URL || "https://api.oops.rest";

export async function POST() {
  const response = await fetch(`${API_URL}/api/v1/auth/guest-users/sign-up`, {
    method: "POST",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Guest 생성 실패" },
      { status: response.status },
    );
  }

  const data = await response.json();
  const { accessToken, userId } = data.data;

  // 세션에 토큰 저장
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  session.accessToken = accessToken;
  session.userId = userId;
  session.userType = "guest";
  await session.save();

  return NextResponse.json({ userId, userType: "guest" });
}
