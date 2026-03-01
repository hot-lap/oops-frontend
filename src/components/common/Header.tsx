"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";

interface HeaderProps {
  title?: string;
  rightActions?: ReactNode;
  onBack?: () => void;
}

export default function Header({ title, rightActions, onBack }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="flex h-14 w-full items-center justify-between px-4 py-4 max-w-[684px] mx-auto">
      <button
        onClick={handleBack}
        aria-label="뒤로 가기"
        className="flex size-6 items-center justify-center"
      >
        <ChevronLeftIcon className="size-6" />
      </button>

      {title ? (
        <h1 className="text-center text-[15px] font-semibold leading-[1.6] text-gray-900">
          {title}
        </h1>
      ) : (
        <div className="size-6" aria-hidden="true" />
      )}

      {rightActions ? (
        <nav aria-label="페이지 액션">
          <ul className="flex items-center gap-2">{rightActions}</ul>
        </nav>
      ) : (
        <div className="size-6" aria-hidden="true" />
      )}
    </header>
  );
}
