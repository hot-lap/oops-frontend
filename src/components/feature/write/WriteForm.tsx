"use client";

import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AsyncBoundary, LeaveConfirmModal } from "@/components";
import { useModalStore } from "@/stores/useModalStore";
import { useCreatePost } from "@/hooks/queries/usePosts";
import { useUpdatePost } from "@/hooks/mutations/useUpdatePost";
import { CalendarModal } from "./CalendarModal";
import { ConfigSelectorSkeleton } from "./ConfigSelectorSkeleton";
import { ConfigSections, type WriteFormData } from "./ConfigSections";
import { WriteFormHeader } from "./WriteFormHeader";
import { EmotionCharacter } from "./EmotionCharacter";
import { DescriptionInput } from "./DescriptionInput";
import { ImpactScoreSection } from "./ImpactScoreSection";
import { WriteFormSubmitButton } from "./WriteFormSubmitButton";
import type { PostResponse } from "@/types/api/posts";

interface WriteFormProps {
  postId?: number;
  initialData?: PostResponse;
}

function getDefaultValues(initialData?: PostResponse) {
  if (!initialData) {
    return {
      description: "",
      score: 3,
      categories: [],
      customCategories: [],
      causes: [],
      feelings: [],
      date: new Date(),
    };
  }
  const categories = (initialData.categories || initialData.category || [])
    .filter((c) => c.category && !c.customCategory)
    .map((c) => c.category) as string[];
  const customCategories = (
    initialData.categories ||
    initialData.category ||
    []
  )
    .filter((c) => c.customCategory)
    .map((c) => c.customCategory as string);
  return {
    description: initialData.content,
    score: initialData.impactIntensity,
    categories,
    customCategories,
    causes: initialData.cause ? [initialData.cause] : [],
    feelings: initialData.feelings || initialData.feeling || [],
    date: new Date(initialData.postedAt),
  };
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
    watch,
    formState: { errors, isDirty },
  } = useForm<WriteFormData>({
    defaultValues: getDefaultValues(initialData),
  });

  const selectedDate = useWatch({ control, name: "date" });
  const score = useWatch({ control, name: "score" });

  const leavePage = useCallback(() => router.push("/"), [router]);

  const showLeaveConfirmModal = useCallback(() => {
    showModal({
      component: LeaveConfirmModal,
      props: {
        onConfirm: leavePage,
        onCancel: () => hideModal(true),
      },
      closeOnDimmedClick: true,
    });
  }, [showModal, hideModal, leavePage]);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;
    window.history.pushState({ preventBack: true }, "", window.location.href);
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.isModal) return;
      window.history.pushState({ preventBack: true }, "", window.location.href);
      showLeaveConfirmModal();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty, showLeaveConfirmModal]);

  const handleBackClick = () => {
    if (!isDirty) {
      leavePage();
      return;
    }
    showLeaveConfirmModal();
  };

  const handleSelectDate = (date: Date) => setValue("date", date);

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

  const onSubmit = (data: WriteFormData) => {
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
      const redirectTo = isEditMode ? `/history/${postId}` : "/";
      router.replace(
        `/write/success?redirectTo=${encodeURIComponent(redirectTo)}`,
      );
    };

    if (isEditMode) {
      updatePostMutation.mutate(
        { postId: postId!, data: postData },
        { onSuccess },
      );
    } else {
      createPostMutation.mutate(postData, { onSuccess });
    }
  };

  const isPending =
    createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <div className="min-h-screen flex justify-center w-full bg-stone-50">
      <div className="mx-6 w-full max-w-[684px] h-full">
        <WriteFormHeader
          selectedDate={selectedDate}
          onBackClick={handleBackClick}
          onCalendarClick={showCalendarModal}
        />

        <EmotionCharacter score={score} />

        <div className="flex flex-col gap-3">
          <DescriptionInput register={register} errors={errors} />
          <ImpactScoreSection register={register} watch={watch} />
          <AsyncBoundary pendingFallback={<ConfigSelectorSkeleton />}>
            <ConfigSections control={control} setValue={setValue} />
          </AsyncBoundary>
        </div>
      </div>

      <WriteFormSubmitButton
        isPending={isPending}
        isEditMode={isEditMode}
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
