"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRandomTitle } from "@/hooks/useRandomTitle";
import {
  TYPES,
  REASONS,
  EMOTIONS,
  EMOTION_SCORE_MAP,
} from "../../constants/constants";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type FormData = {
  description: string;
  score: number;
  types: string[];
  reasons: string[];
  emotions: string[];
};

export default function CreateForm() {
  const router = useRouter();
  const { title, subtitle } = useRandomTitle("loading");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      description: "",
      score: 3,
      types: [],
      reasons: [],
      emotions: [],
    },
  });

  const selectedTypes = watch("types");
  const selectedReasons = watch("reasons");
  const selectedEmotions = watch("emotions");
  const score = watch("score");
  const currentScoreData = EMOTION_SCORE_MAP[score as 1 | 2 | 3 | 4 | 5];
  const [isSaved, setIsSaved] = useState(false);

  const [date, setDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  }).format(date);

  const toggleSelect = (field: keyof FormData, value: string) => {
    const current = watch(field) as string[];
    if (current.includes(value)) {
      setValue(
        field,
        current.filter((v) => v !== value)
      );
    } else {
      setValue(field, [...current, value]);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("제출 데이터:", data);

    // 저장 화면 보여주기
    setIsSaved(true);

    // 1.5초 후 홈으로 이동
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center font-['Pretendard']">
      <div className="w-96 lg:w-full bg-stone-50 min-h-screen px-6 lg:px-94">
        {/* 로딩 화면 */}
        {isSaved && (
          <div className="flex justify-center items-center">
            <div className="w-96 flex justify-center text-center items-center bg-gray-50 min-h-screen">
              <div className="animate-pulse">
                <h2 className="text-2xl font-semibold text-stone-900 font-['Pretendard'] leading-10 mb-2">
                  {title}
                </h2>
                <p className="text-stone-700 text-base font-medium font-['Pretendard'] leading-6">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* 날짜 */}
        <div className="flex justify-between items-center h-14">
          <button onClick={() => router.back()} className="text-xl">
            <Image
              src="/icons/chevron-left.svg"
              alt="left"
              width={24}
              height={24}
            />
          </button>
          <div>
            {/* 날짜 */}
            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-1">
                <h2 className="text-md font-semibold">
                  {formattedDate.replace(" ", " ")}
                </h2>
                <button onClick={() => setIsCalendarOpen(true)}>
                  <Image
                    src="/icons/chevron-down.svg"
                    alt="down"
                    width={17}
                    height={17}
                  />
                </button>
              </div>
              {isCalendarOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Calendar
                      onChange={(selectedDate) => {
                        setDate(selectedDate as Date);
                        setIsCalendarOpen(false);
                      }}
                      value={date}
                      locale="ko-KR"
                    />

                    <button
                      onClick={() => setIsCalendarOpen(false)}
                      className="mt-4 w-full py-2 rounded-lg bg-gray-200"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              )}
              <div></div>
            </div>
          </div>
          <div className="w-2"></div>
        </div>

        {/* 캐릭터 */}
        <div className="flex justify-center mt-10 mb-4">
          <Image
            src={currentScoreData.img}
            alt={`emotion-${score}`}
            width={80}
            height={80}
          />
        </div>

        <div className="flex flex-col gap-3">
          {/* 텍스트 입력 */}
          <div>
            <textarea
              {...register("description", {
                required: "오늘의 실패를 적어주세요.",
              })}
              placeholder="오늘 어떤 일이 있었나요?"
              className={`
            w-full min-h-[150px] bg-white p-4 rounded-[20px] border p-5
            ${errors.description ? "outline-1 outline-red-500" : "border-gray-300"}
            focus:outline-none focus:ring-0
            ${errors.description ? "focus:border-red-500" : "focus:outline-none"}
          `}
            />
            {errors.description && (
              <div className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </div>
            )}
          </div>

          {/* 영향도 */}
          <div className="bg-white p-4 rounded-[20px] outline outline-1 outline-stone-200 p-5">
            <div className="self-stretch justify-start text-stone-900 text-base font-semibold leading-6 mb-4">
              영향도
            </div>
            {/* 메인 텍스트 */}
            <div className="justify-start text-black text-base font-semibold font-['Pretendard'] leading-6 mb-1">
              {currentScoreData.title}
            </div>
            {/* 서브 텍스트 */}
            <div className="self-stretch justify-start text-stone-500 text-xs font-normal font-['Pretendard'] leading-5 mb-4">
              {currentScoreData.subtitle}
            </div>
            <div>
              <div className="flex justify-between text-sm bg-gray-100 text-gray-600 rounded-2xl h-10">
                <div className="ml-4 mr-3 flex flex-col items-center justify-center w-10 h-full">
                  1점
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  {...register("score")}
                  className="w-full"
                />
                <div className="mr-4 ml-3 flex flex-col items-center justify-center w-10 h-full">
                  5점
                </div>
              </div>
            </div>
          </div>

          {/* 유형 */}
          <div className="bg-white p-5 rounded-[20px] outline outline-1 outline-stone-200">
            <div className="justify-start text-stone-900 text-base font-semibold font-['Pretendard'] leading-6 mb-4">
              유형
            </div>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleSelect("types", item)}
                  className={`px-3 py-2 rounded-full ${
                    selectedTypes.includes(item)
                      ? "bg-stone-600 text-white"
                      : "bg-white text-stone-900 outline outline-1 outline-offset-[-1px] outline-stone-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 원인 */}
          <div className="bg-white p-5 rounded-[20px] outline outline-1 outline-stone-200">
            <div className="justify-start text-stone-900 text-base font-semibold font-['Pretendard'] leading-6 mb-4">
              원인
            </div>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleSelect("reasons", item)}
                  className={`px-4 py-2 rounded-full ${
                    selectedReasons.includes(item)
                      ? "bg-stone-600 text-white"
                      : "bg-white text-gray-900 outline outline-1 outline-offset-[-1px] outline-stone-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 감정 */}
          <div className="bg-white p-5 mb-25 rounded-[20px] outline outline-1 outline-stone-200">
            <div className="justify-start text-stone-900 text-base font-semibold font-['Pretendard'] leading-6 mb-4">
              감정
            </div>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleSelect("emotions", item)}
                  className={`px-4 py-2 rounded-full ${
                    selectedEmotions.includes(item)
                      ? "bg-stone-600 text-white"
                      : "bg-white text-gray-900 outline outline-1 outline-offset-[-1px] outline-stone-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 저장 버튼 */}
        {!isSaved && (
          <button
            onClick={handleSubmit(onSubmit)}
            className="fixed bottom-5 w-84 lg:w-[calc(100%-750px)] mx-auto left-0 right-0 bg-stone-600 text-white py-4 rounded-xl font-semibold"
          >
            저장
          </button>
        )}
      </div>
    </div>
  );
}
