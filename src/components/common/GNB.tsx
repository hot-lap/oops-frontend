"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { redirectToGoogleOAuth } from "@/lib/oauth/google";
import { cn } from "@/lib/utils";

export default function GNB(props: {
  className?: string;
  isVisibleLoginButton?: boolean;
}) {
  const { className, isVisibleLoginButton = true } = props;
  const { userType } = useAuthStore();

  return (
    <header
      className={cn(
        "relative mx-auto flex h-14 w-full max-w-[684px] items-center justify-center px-4",
        className,
      )}
    >
      <Link href="/">
        <Image src="/icons/OopsLogo.svg" alt="Oops!" width={50} height={24} />
      </Link>
      {isVisibleLoginButton && userType === "guest" && (
        <button
          onClick={redirectToGoogleOAuth}
          className="absolute right-4 flex h-8 items-center justify-center rounded-full border border-gray-200 px-3 group hover:bg-gray-500"
        >
          <span className="text-[13px] font-medium leading-[1.6] text-gray-500 group-hover:text-gray-200">
            로그인
          </span>
        </button>
      )}
    </header>
  );
}
