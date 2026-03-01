"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { redirectToGoogleOAuth } from "@/lib/oauth/google";

export default function GNB() {
  const { userType } = useAuthStore();

  return (
    <header className="relative mx-auto flex h-14 w-full max-w-[684px] items-center justify-center px-4">
      <Link href="/">
        <Image src="/icons/OopsLogo.svg" alt="Oops!" width={50} height={24} />
      </Link>
      {userType === "guest" && (
        <button
          onClick={redirectToGoogleOAuth}
          className="absolute right-4 flex h-8 items-center justify-center rounded-full border border-gray-200 px-3"
        >
          <span className="text-[13px] font-medium leading-[1.6] text-gray-500">
            로그인
          </span>
        </button>
      )}
    </header>
  );
}
