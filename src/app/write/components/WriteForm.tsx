"use client";

import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect, useCallback, Activity } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLoadingTitle } from "@/hooks/useLoadingTitle";
import { Calendar, AsyncBoundary, LeaveConfirmModal } from "@/components";
import { EMOTION_SCORES } from "@/constants/constants";
import { useModalStore } from "@/stores/useModalStore";
import { useCreatePost } from "@/hooks/queries/usePosts";
import { ConfigSelector } from "./ConfigSelector";
import { ConfigSelectorSkeleton } from "./ConfigSelectorSkeleton";

type FormData = {
  description: string;
  score: number;
  categories: string[];
  causes: string[];
  feelings: string[];
  date: Date | null;
};

export function WriteForm() {
  const router = useRouter();
  const { title, subtitle } = useLoadingTitle();
  const { showModal, hideModal } = useModalStore();
  const createPostMutation = useCreatePost();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      description: "",
      score: 3,
      categories: [],
      causes: [],
      feelings: [],
      date: new Date(),
    },
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const selectedDate = useWatch({ control, name: "date" });
  const selectedCategories = useWatch({ control, name: "categories" }) ?? [];
  const selectedCauses = useWatch({ control, name: "causes" }) ?? [];
  const selectedFeelings = useWatch({ control, name: "feelings" }) ?? [];
  const score = useWatch({ control, name: "score" });

  const currentScoreData = EMOTION_SCORES[score - 1];
  const [isSaved, setIsSaved] = useState(false);

  // 페이지 이탈 처리
  const leavePage = useCallback(() => {
    router.push("/");
  }, [router]);

  // 이탈 확인 모달 표시
  const showLeaveConfirmModal = useCallback(() => {
    showModal({
      component: LeaveConfirmModal,
      props: {
        onConfirm: leavePage,
        onCancel: () => {
          hideModal(true);
        },
      },
      closeOnDimmedClick: true,
    });
  }, [showModal, hideModal, leavePage]);

  // 브라우저 뒤로가기 감지
  useEffect(() => {
    // 폼이 수정되지 않았으면 히스토리 조작 불필요
    if (!isDirty) return;

    // 히스토리에 현재 상태 추가 (뒤로가기 감지용)
    window.history.pushState({ preventBack: true }, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      // 모달 관련 상태면 무시
      if (event.state?.isModal) return;

      // 저장 완료 상태면 그냥 이동
      if (isSaved) return;

      // 뒤로가기 방지를 위해 다시 히스토리 추가
      window.history.pushState({ preventBack: true }, "", window.location.href);
      showLeaveConfirmModal();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty, isSaved, showLeaveConfirmModal]);

  // 헤더 뒤로가기 버튼 클릭 핸들러
  const handleBackClick = () => {
    // 저장 완료 또는 폼이 수정되지 않았으면 바로 이동
    if (isSaved || !isDirty) {
      leavePage();
      return;
    }
    showLeaveConfirmModal();
  };

  const handleSelectDate = (value: Date | undefined) => {
    if (value) {
      setValue("date", value);
      setIsCalendarOpen(false);
    }
  };

  const toggleSelect = (
    field: "categories" | "causes" | "feelings",
    value: string,
  ) => {
    let current: string[] = [];

    if (field === "categories") current = selectedCategories;
    if (field === "causes") current = selectedCauses;
    if (field === "feelings") current = selectedFeelings;

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
    createPostMutation.mutate(
      {
        content: data.description,
        impactIntensity: data.score,
        category: data.categories[0] ?? "",
        cause: data.causes[0] ?? "",
        feeling: data.feelings[0] ?? "",
      },
      {
        onSuccess: () => {
          setIsSaved(true);
          setTimeout(() => {
            router.push("/");
          }, 1500);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center w-full bg-stone-50">
      <div className="mx-6 w-full max-w-[684px]">
        {/* 로딩 화면 */}
        {isSaved && (
          <div className="flex justify-center items-center">
            <div className="w-96 flex justify-center text-center items-center bg-gray-50 min-h-screen">
              <div className="animate-pulse">
                <h2 className="text-2xl font-semibold text-stone-900 leading-10 mb-2">
                  {title}
                </h2>
                <p className="text-stone-700 text-base font-medium leading-6">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 날짜 선택 영역 */}
        <div className="flex justify-between items-center h-14 mt-4">
          <button onClick={handleBackClick} className="text-xl">
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

        {/* 캐릭터 - Activity로 모든 이미지 프리로드 */}
        <div className="flex justify-center mt-10 mb-4">
          {EMOTION_SCORES.map((emotionData, index) => (
            <Activity
              key={index}
              mode={score - 1 === index ? "visible" : "hidden"}
            >
              <Image
                src={emotionData.img}
                alt={`emotion-${index + 1}`}
                width={80}
                height={80}
                loading="eager"
              />
            </Activity>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {/* 텍스트 입력 */}
          <div>
            <textarea
              {...register("description", {
                required: "오늘의 실수를 적어주세요.",
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
            <div className="justify-start text-black text-base font-semibold leading-6 mb-1">
              {currentScoreData.title}
            </div>
            <div className="self-stretch justify-start text-stone-500 text-xs font-normal leading-5 mb-4">
              {currentScoreData.subtitle}
            </div>
            <div>
              <div className="flex items-center gap-3 bg-stone-100 text-stone-600 text-xs font-medium rounded-full h-10 px-4">
                <span>1점</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  {...register("score")}
                  className="flex-1 range-slider"
                  style={{
                    background: `linear-gradient(to right, #57534e ${(score - 1) * 25}%, #d6d3d1 ${(score - 1) * 25}%)`,
                  }}
                />
                <span>5점</span>
              </div>
            </div>
          </div>

          {/* 유형, 원인, 감정 - AsyncBoundary로 감싸기 */}
          <AsyncBoundary pendingFallback={<ConfigSelectorSkeleton />}>
            <ConfigSelector
              selectedCategories={selectedCategories}
              selectedCauses={selectedCauses}
              selectedFeelings={selectedFeelings}
              onToggleCategory={(value) => toggleSelect("categories", value)}
              onToggleCause={(value) => toggleSelect("causes", value)}
              onToggleFeeling={(value) => toggleSelect("feelings", value)}
            />
            {/* <ConfigSelectorSkeleton /> */}
          </AsyncBoundary>
        </div>
      </div>

      {/* 저장 버튼 */}
      {!isSaved && (
        <div className="w-full flex justify-center fixed bottom-5 px-6">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={createPostMutation.isPending}
            className={`w-full max-w-[684px] py-4 rounded-xl ${
              createPostMutation.isPending
                ? "bg-stone-300 cursor-not-allowed"
                : "bg-stone-600"
            }`}
          >
            {createPostMutation.isPending ? (
              <span className="flex items-center justify-center gap-2 text-stone-500 font-semibold">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-stone-500" />
                저장 중입니다.
              </span>
            ) : (
              <span className="text-white font-semibold">저장</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
