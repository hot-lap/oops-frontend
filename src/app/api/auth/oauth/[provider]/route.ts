import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SessionData, sessionOptions } from "@/lib/session";

const API_URL = process.env.API_URL || "https://api.oops.rest";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const body = await request.json();
  const { authorizationCode, redirectUri } = body;

  const response = await fetch(`${API_URL}/api/v1/oauth/${provider}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorizationCode, redirectUri }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    return NextResponse.json(
      { error: errorData?.reason || "OAuth 로그인 실패" },
      { status: response.status },
    );
  }

  const data = await response.json();
  const { userId, tokens } = data.data;

  // 세션에 토큰 저장
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  session.accessToken = tokens.accessToken;
  session.refreshToken = tokens.refreshToken;
  session.userId = userId;
  session.userType = "user";
  await session.save();

  return NextResponse.json({ userId, userType: "user" });
}
