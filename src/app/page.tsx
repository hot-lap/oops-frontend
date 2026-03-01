"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHomeTitle } from "@/hooks/useHomeTitle";
import { useState, type PointerEvent } from "react";
import { AsyncBoundary, Skeleton, RecentPosts, GNB } from "@/components";

export default function Home() {
  const router = useRouter();
  const { title, subtitle } = useHomeTitle();
  const [isHovered, setIsHovered] = useState(false);

  const goToPage = () => router.push("/write");

  // 데스크탑: hover, 모바일: 꾹 누르는 동안만 hover
  const hoverHandlers = {
    onPointerEnter: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setIsHovered(true);
    },
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType === "mouse") setIsHovered(false);
    },
    onPointerDown: (e: PointerEvent) => {
      if (e.pointerType === "touch") setIsHovered(true);
    },
    onPointerUp: (e: PointerEvent) => {
      if (e.pointerType === "touch") setIsHovered(false);
    },
    onPointerCancel: (e: PointerEvent) => {
      if (e.pointerType === "touch") setIsHovered(false);
    },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-stone-50">
      <div className="w-full max-w-[684px] min-h-screen flex flex-col items-center overflow-hidden">
        {/* GNB */}
        <GNB />

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8 mt-14">
          {/* Emotion Image (hover 상태에 따라 변경) */}
          <div
            className="relative flex h-[180px] w-[200px] items-center justify-center"
            {...hoverHandlers}
          >
            <Image
              src="/icons/homehover.svg"
              alt=""
              width={200}
              height={180}
              unoptimized
              className={`absolute transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
            />
            <Image
              src="/icons/emotion1.svg"
              alt=""
              width={180}
              height={180}
              unoptimized
              className={`transition-opacity duration-200 ${isHovered ? "opacity-0" : "opacity-100"}`}
            />
          </div>

          {/* Title Text */}
          <div className="self-stretch flex flex-col justify-start items-center gap-2">
            <h1 className="whitespace-normal break-keep text-center justify-start text-stone-900 text-2xl font-semibold leading-10">
              {title}
            </h1>
            <p className="self-stretch text-center justify-start text-stone-700 text-base font-medium leading-6">
              {subtitle}
            </p>
          </div>

          {/* Button (hover시 Emotion Image변경) */}
          <button
            onClick={goToPage}
            {...hoverHandlers}
            className="cursor-pointer w-40 h-12 bg-stone-600 rounded-full text-white text-base font-semibold flex justify-center items-center"
          >
            기록하기
          </button>
        </div>

        {/* Recent Posts */}
        <div className="w-full mt-24">
          <AsyncBoundary
            pendingFallback={
              <div className="w-full flex flex-col gap-3 items-center px-6">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="w-full h-[46px] rounded-xl" />
              </div>
            }
          >
            <RecentPosts />
          </AsyncBoundary>
        </div>
      </div>
    </div>
  );
}
