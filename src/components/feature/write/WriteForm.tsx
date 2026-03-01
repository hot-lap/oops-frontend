"use client";

import { useForm, useWatch, Control, UseFormSetValue } from "react-hook-form";
import { useEffect, useCallback, Activity } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { AsyncBoundary, LeaveConfirmModal } from "@/components";
import { EMOTION_SCORES } from "@/constants/constants";
import { useModalStore } from "@/stores/useModalStore";
import { useCreatePost, useSuspensePostConfig } from "@/hooks/queries/usePosts";
import { useUpdatePost } from "@/hooks/mutations/useUpdatePost";
import { CalendarModal } from "./CalendarModal";
import { ConfigSelector } from "./ConfigSelector";
import { ConfigSelectorSkeleton } from "./ConfigSelectorSkeleton";
import type { PostResponse } from "@/types/api/posts";

type FormData = {
  description: string;
  score: number;
  categories: string[];
  customCategories: string[];
  causes: string[];
  feelings: string[];
  date: Date | null;
};

// Config를 fetch하고 ConfigSelector를 렌더링하는 내부 컴포넌트
interface ConfigSectionsProps {
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
}

function ConfigSections({ control, setValue }: ConfigSectionsProps) {
  const { data: config } = useSuspensePostConfig();

  // useWatch를 내부에서 사용
  const selectedCategories = useWatch({ control, name: "categories" }) ?? [];
  const customCategories =
    useWatch({ control, name: "customCategories" }) ?? [];
  const selectedCauses = useWatch({ control, name: "causes" }) ?? [];
  const selectedFeelings = useWatch({ control, name: "feelings" }) ?? [];

  // "직접 입력"을 제외한 카테고리 목록
  const regularCategories = config.category.categories.filter(
    (item) => item !== "직접 입력",
  );

  // 토글 로직도 내부에서 처리
  const toggleSelect = (
    field: "categories" | "causes" | "feelings",
    value: string,
    multipleSelectable: boolean,
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
    } else if (multipleSelectable) {
      setValue(field, [...current, value]);
    } else {
      setValue(field, [value]);
    }
  };

  // 커스텀 카테고리 추가
  const handleAddCustomCategory = (value: string) => {
    if (customCategories.length >= 3) {
      toast.error("직접 입력은 최대 3개까지 가능해요.");
      return;
    }
    if (!customCategories.includes(value)) {
      setValue("customCategories", [...customCategories, value]);
    }
  };

  // 커스텀 카테고리 삭제
  const handleRemoveCustomCategory = (value: string) => {
    setValue(
      "customCategories",
      customCategories.filter((v) => v !== value),
    );
  };

  return (
    <ConfigSelector className="flex flex-col gap-3">
      <ConfigSelector.Section title="유형">
        <ConfigSelector.ChipGroup
          items={regularCategories}
          selected={selectedCategories}
          onToggle={(item) =>
            toggleSelect("categories", item, config.category.multipleSelectable)
          }
        />
        <ConfigSelector.CustomChips
          items={customCategories}
          onRemove={handleRemoveCustomCategory}
        />
        <ConfigSelector.CustomInput onAdd={handleAddCustomCategory} />
      </ConfigSelector.Section>

      <ConfigSelector.Section title="원인">
        <ConfigSelector.ChipGroup
          items={config.cause.causes}
          selected={selectedCauses}
          onToggle={(item) =>
            toggleSelect("causes", item, config.cause.multipleSelectable)
          }
        />
      </ConfigSelector.Section>

      <ConfigSelector.Section title="감정" className="mb-25">
        <ConfigSelector.ChipGroup
          items={config.feeling.feelings}
          selected={selectedFeelings}
          onToggle={(item) =>
            toggleSelect("feelings", item, config.feeling.multipleSelectable)
          }
        />
      </ConfigSelector.Section>
    </ConfigSelector>
  );
}

interface WriteFormProps {
  postId?: number;
  initialData?: PostResponse;
}

export function WriteForm({ postId, initialData }: WriteFormProps = {}) {
  const router = useRouter();
  const { showModal, hideModal } = useModalStore();
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  const isEditMode = !!postId && !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: isEditMode
      ? {
          description: initialData.content,
          score: initialData.impactIntensity,
          categories: (initialData.categories || initialData.category || [])
            .filter((c) => c.category && !c.customCategory)
            .map((c) => c.category) as string[],
          customCategories: (
            initialData.categories ||
            initialData.category ||
            []
          )
            .filter((c) => c.customCategory)
            .map((c) => c.customCategory as string),
          causes: initialData.cause ? [initialData.cause] : [],
          feelings: initialData.feelings || initialData.feeling || [],
          date: new Date(initialData.postedAt),
        }
      : {
          description: "",
          score: 3,
          categories: [],
          customCategories: [],
          causes: [],
          feelings: [],
          date: new Date(),
        },
  });

  const selectedDate = useWatch({ control, name: "date" });
  const score = useWatch({ control, name: "score" });

  const currentScoreData = EMOTION_SCORES[score - 1];

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

  // 새로고침 방지
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // 브라우저 뒤로가기 감지
  useEffect(() => {
    // 폼이 수정되지 않았으면 히스토리 조작 불필요
    if (!isDirty) return;

    // 히스토리에 현재 상태 추가 (뒤로가기 감지용)
    window.history.pushState({ preventBack: true }, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      // 모달 관련 상태면 무시
      if (event.state?.isModal) return;

      // 뒤로가기 방지를 위해 다시 히스토리 추가
      window.history.pushState({ preventBack: true }, "", window.location.href);
      showLeaveConfirmModal();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty, showLeaveConfirmModal]);

  // 헤더 뒤로가기 버튼 클릭 핸들러
  const handleBackClick = () => {
    // 폼이 수정되지 않았으면 바로 이동
    if (!isDirty) {
      leavePage();
      return;
    }
    showLeaveConfirmModal();
  };

  const handleSelectDate = (date: Date) => {
    setValue("date", date);
  };

  const showCalendarModal = () => {
    showModal({
      component: CalendarModal,
      props: {
        selectedDate: selectedDate ?? undefined,
        onSelectDate: handleSelectDate,
      },
      closeOnDimmedClick: true,
    });
  };

  const onSubmit = (data: FormData) => {
    // 일반 카테고리와 커스텀 카테고리 합치기
    const allCategories = [
      ...data.categories.map((cat) => ({ category: cat })),
      ...data.customCategories.map((custom) => ({
        category: "직접 입력",
        customCategory: custom,
      })),
    ];

    const postData = {
      content: data.description,
      impactIntensity: data.score,
      categories: allCategories,
      cause: data.causes[0],
      feelings: data.feelings,
      postedAt: data.date?.toISOString(),
    };

    const onSuccess = () => {
      // replace를 사용하여 히스토리에서 작성 페이지 제거
      // 뒤로가기 시 작성 페이지로 돌아가지 않음
      const redirectTo = isEditMode ? `/history/${postId}` : "/";
      router.replace(
        `/write/success?redirectTo=${encodeURIComponent(redirectTo)}`,
      );
    };

    if (isEditMode) {
      updatePostMutation.mutate({ postId, data: postData }, { onSuccess });
    } else {
      createPostMutation.mutate(postData, { onSuccess });
    }
  };

  return (
    <div className="min-h-screen flex justify-center w-full bg-stone-50">
      <div className="mx-6 w-full max-w-[684px] h-full">
        {/* 날짜 선택 영역 */}
        <div className="flex justify-between items-center h-14">
          <button onClick={handleBackClick} className="text-xl">
            <Image
              src="/icons/chevron-left.svg"
              alt="left"
              width={24}
              height={24}
            />
          </button>

          <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={showCalendarModal}
          >
            <h2 className="text-md font-semibold">
              {selectedDate
                ? `${selectedDate.getFullYear()}년 ${
                    selectedDate.getMonth() + 1
                  }월 ${selectedDate.getDate()}일`
                : "날짜 선택"}
            </h2>

            <Image
              src="/icons/chevron-down.svg"
              alt="toggle-calendar"
              width={17}
              height={17}
            />
          </button>

          <div className="w-4"></div>
        </div>

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
              maxLength={2000}
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
            <ConfigSections control={control} setValue={setValue} />
          </AsyncBoundary>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="w-full flex justify-center fixed bottom-5 px-6">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={
            createPostMutation.isPending || updatePostMutation.isPending
          }
          className={`w-full max-w-[684px] py-4 rounded-xl ${
            createPostMutation.isPending || updatePostMutation.isPending
              ? "bg-stone-300 cursor-not-allowed"
              : "bg-stone-600"
          }`}
        >
          {createPostMutation.isPending || updatePostMutation.isPending ? (
            <span className="flex items-center justify-center gap-2 text-stone-500 font-semibold">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-stone-500" />
              저장 중입니다.
            </span>
          ) : (
            <span className="text-white font-semibold">
              {isEditMode ? "수정" : "저장"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
