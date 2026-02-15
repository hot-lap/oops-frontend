import { SessionOptions } from "iron-session";

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  userType?: "guest" | "user";
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "oops_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 90 * 24 * 60 * 60, // 90일
  },
};
