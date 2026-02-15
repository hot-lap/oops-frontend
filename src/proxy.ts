import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const session = await getIronSession<SessionData>(
    request,
    response,
    sessionOptions,
  );

  // 비민감 인증 상태를 일반 쿠키에 설정 (클라이언트 읽기용)
  if (session.userId) {
    response.cookies.set(
      "oops_auth_state",
      JSON.stringify({
        userId: session.userId,
        userType: session.userType,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    );
  } else {
    response.cookies.delete("oops_auth_state");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|icons|images|.*\\..*).*)"],
};
