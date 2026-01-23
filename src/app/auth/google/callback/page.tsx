"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { oauthSignup } from "@/lib/api/oauth";
import { saveUserTokens, clearTokens } from "@/lib/auth/token";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      // Google에서 에러 반환한 경우
      if (errorParam) {
        setError("Google 로그인이 취소되었습니다.");
        return;
      }

      // 인가 코드가 없는 경우
      if (!code) {
        setError("인가 코드를 받지 못했습니다.");
        return;
      }

      try {
        // OAuth 회원가입/로그인 요청
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
        if (!redirectUri) {
          setError("Redirect URI가 설정되지 않았습니다.");
          return;
        }

        const response = await oauthSignup("google", code, redirectUri);

        // 기존 Guest 토큰 삭제 후 User 토큰 저장
        clearTokens();
        saveUserTokens(
          response.tokens.accessToken,
          response.tokens.refreshToken,
        );

        // 메인 페이지로 이동
        router.replace("/");
      } catch (err) {
        console.error("OAuth 로그인 실패:", err);
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // 에러 발생 시
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-6">
        <div className="text-center">
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => router.replace("/")}
            className="px-6 py-3 bg-stone-600 text-white rounded-xl font-semibold"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 로딩 상태
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
      <Image
        src="/images/emotion-3.svg"
        alt="loading"
        width={80}
        height={80}
        className="mb-6 animate-bounce"
      />
      <p className="text-stone-600 font-medium">로그인 중...</p>
    </div>
  );
}
