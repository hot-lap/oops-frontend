import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Oops — 실수를 기록하는 공간",
  description:
    "Oops는 오늘 마음에 걸린 실수나 실패를 조용히 기록하고, 하루를 정리할 수 있도록 돕는 개인 기록 공간입니다.",
  openGraph: {
    title: "Oops — 실수를 기록하는 공간",
    description:
      "Oops는 오늘 마음에 걸린 실수나 실패를 조용히 기록하고, 하루를 정리할 수 있도록 돕는 개인 기록 공간입니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "Oops",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oops — 실수를 기록하는 공간",
    description:
      "Oops는 오늘 마음에 걸린 실수나 실패를 조용히 기록하고, 하루를 정리할 수 있도록 돕는 개인 기록 공간입니다.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
