"use client";

import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoadingTitle } from "@/hooks/useLoadingTitle";
import { Calendar } from "@/components";
import {
  TYPES,
  REASONS,
  EMOTIONS,
  EMOTION_SCORE_MAP,
} from "../../constants/constants";

type FormData = {
  description: string;
  score: number;
  types: string[];
  reasons: string[];
  emotions: string[];
  date: Date | null;
};

export default function CreateForm() {
  const router = useRouter();
  const { title, subtitle } = useLoadingTitle();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      description: "",
      score: 3,
      types: [],
      reasons: [],
      emotions: [],
      date: new Date(),
    },
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const selectedDate = useWatch({ control, name: "date" });
  const selectedTypes = useWatch({ control, name: "types" }) ?? [];
  const selectedReasons = useWatch({ control, name: "reasons" }) ?? [];
  const selectedEmotions = useWatch({ control, name: "emotions" }) ?? [];
  const score = useWatch({ control, name: "score" });

  const currentScoreData = EMOTION_SCORE_MAP[score as 1 | 2 | 3 | 4 | 5];
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectDate = (value: Date | undefined) => {
    if (value) {
      setValue("date", value);
      setIsCalendarOpen(false);
    }
  };

  const toggleSelect = (field: keyof FormData, value: string) => {
    let current: string[] = [];

    if (field === "types") current = selectedTypes;
    if (field === "reasons") current = selectedReasons;
    if (field === "emotions") current = selectedEmotions;

    if (current.includes(value)) {
      setValue(
        field,
        current.filter((v) => v !== value),
      );
    } else {
      setValue(field, [...current, value]);
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("제출 데이터:", data);

    setIsSaved(true);

    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex justify-center items-center w-full bg-stone-50 ">
      <div className="mx-6 w-full max-w-[684px]">
        {/* 로딩 화면 */}
        {isSaved && (
          <div className="flex justify-center items-center">
            <div className="w-96 flex justify-center text-center items-center bg-gray-50 min-h-screen">
              <div className="animate-pulse">
                <h2 className="text-2xl font-semibold text-stone-900  leading-10 mb-2">
                  {title}
                </h2>
                <p className="text-stone-700 text-base font-medium  leading-6">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* 날짜 선택 영역 */}
        <div className="flex justify-between items-center h-14 mt-4">
          <button onClick={() => router.back()} className="text-xl">
            <Image
              src="/icons/chevron-left.svg"
              alt="left"
              width={24}
              height={24}
            />
          </button>

          <div className="flex items-center gap-2 cursor-pointer">
            <h2 className="text-md font-semibold">
              {selectedDate
                ? `${selectedDate.getFullYear()}년 ${
                    selectedDate.getMonth() + 1
                  }월 ${selectedDate.getDate()}일`
                : "날짜 선택"}
            </h2>

            <button onClick={() => setIsCalendarOpen(true)}>
              <Image
                src="/icons/chevron-down.svg"
                alt="toggle-calendar"
                width={17}
                height={17}
              />
            </button>
          </div>

          <div className="w-4"></div>
        </div>

        {/* 달력 모달 */}
        {isCalendarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setIsCalendarOpen(false)}
          >
            <div
              className="bg-white p-4 rounded-xl shadow-lg animate-fadeIn z-60"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={handleSelectDate}
                className="rounded-lg"
              />
            </div>
          </div>
        )}

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
            ${errors.description ? "border border-red-500" : "border-stone-200"}
            focus:outline-none focus:ring-0
            ${errors.description ? "focus:border-red-500" : "focus:border-stone-200"}
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
            <div className="justify-start text-black text-base font-semibold  leading-6 mb-1">
              {currentScoreData.title}
            </div>
            {/* 서브 텍스트 */}
            <div className="self-stretch justify-start text-stone-500 text-xs font-normal  leading-5 mb-4">
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
            <div className="justify-start text-stone-900 text-base font-semibold  leading-6 mb-4">
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
            <div className="justify-start text-stone-900 text-base font-semibold  leading-6 mb-4">
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
            <div className="justify-start text-stone-900 text-base font-semibold  leading-6 mb-4">
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
      </div>
      {/* 저장 버튼 */}
      {!isSaved && (
        <div className="w-full flex justify-center fixed bottom-5 px-6">
          <button
            onClick={handleSubmit(onSubmit)}
            className="w-full max-w-[684px] bg-stone-600 py-4 rounded-xl"
          >
            <span className="text-white font-semibold">저장</span>
          </button>
        </div>
      )}
    </div>
  );
}
