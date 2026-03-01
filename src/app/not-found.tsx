import Image from "next/image";
import Link from "next/link";
import { GNB } from "@/components";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-stone-50">
      <div className="w-full max-w-[696px]">
        <GNB />
      </div>

      <div className="mt-[120px] flex flex-col items-center">
        {/* 404 Display */}
        <div className="relative h-[124px] w-[237px]">
          <Image
            src="/icons/emotion-404.svg"
            alt="404"
            width={237}
            height={124}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-center text-2xl font-semibold leading-[1.6] text-stone-900">
            요청하신 페이지를 찾을 수 없어요
          </h1>
          <p className="text-center text-[15px] font-medium leading-[1.6] text-stone-700">
            입력하신 주소가 정확한지 다시 한번 확인해주세요
          </p>
        </div>

        {/* Button */}
        <Link
          href="/"
          className="mt-8 flex h-12 w-40 items-center justify-center rounded-full bg-stone-600 text-[15px] font-semibold text-white"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
