"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHomeTitle } from "@/hooks/useHomeTitle";
import { useState, Activity } from "react";

export default function Home() {
  const router = useRouter();
  const { title, subtitle } = useHomeTitle();
  const [isHovered, setIsHovered] = useState(false);

  const goToPage = () => router.push("/write");

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 w-full min-h-screen bg-stone-50 flex flex-col items-center overflow-hidden">
        {/* Logo Header */}
        <div className="h-14 flex justify-center items-center w-full p-4">
          <Image src="/icons/OopsLogo.svg" alt="logo" width={50} height={24} />
        </div>
        <div className="flex flex-col items-center gap-8 mt-14">
          {/* Emotion Image (hover 상태에 따라 변경) */}
          <div
            className="rounded-full flex justify-center items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Activity mode={isHovered ? "visible" : "hidden"}>
              <Image
                src="/icons/homehover.svg"
                alt="hover"
                width={200}
                height={180}
                loading="eager"
              />
            </Activity>
            <Activity mode={!isHovered ? "visible" : "hidden"}>
              <Image
                src="/icons/emotion1.svg"
                alt="default"
                width={180}
                height={180}
                loading="eager"
              />
            </Activity>
          </div>

          {/* Title Text */}
          <div className="self-stretch flex flex-col justify-start items-center gap-2">
            <h1 className="whitespace-normal break-keep text-center justify-start text-stone-900 text-2xl font-semibold  leading-10">
              {title}
            </h1>
            <p className="self-stretch text-center justify-start text-stone-700 text-base font-medium  leading-6">
              {subtitle}
            </p>
          </div>

          {/* Button (hover시 Emotion Image변경) */}
          <button
            onClick={goToPage}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="cursor-pointer w-40 h-12 bg-stone-600 rounded-full text-white text-base font-semibold flex justify-center items-center"
          >
            기록하기
          </button>
        </div>
      </div>
    </div>
  );
}
