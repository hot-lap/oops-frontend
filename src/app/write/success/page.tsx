"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoadingTitle } from "@/hooks/useLoadingTitle";

export default function WriteSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { title, subtitle } = useLoadingTitle();

  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      // replace를 사용하여 히스토리에서 성공 페이지 제거
      // 뒤로가기 시 작성 페이지로 돌아가지 않음
      router.replace(redirectTo);
    }, 1500);

    return () => clearTimeout(timer);
  }, [router, redirectTo]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex w-96 flex-col items-center justify-center text-center">
        <div className="animate-pulse">
          <h2 className="mb-2 text-2xl font-semibold leading-10 text-stone-900">
            {title}
          </h2>
          <p className="text-base font-medium leading-6 text-stone-700">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
