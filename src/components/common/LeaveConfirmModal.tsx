"use client";

import type { ModalComponentProps } from "@/types";

interface LeaveConfirmModalProps {
  onConfirm: () => void;
  onCancel?: () => void;
}

export function LeaveConfirmModal({
  onCancel,
  onConfirm,
}: ModalComponentProps<LeaveConfirmModalProps>) {
  const handleConfirm = () => {
    onCancel?.();
    onConfirm();
  };

  return (
    <div className="bg-white flex flex-col gap-3 items-center py-5 rounded-[20px] w-[327px] pointer-events-auto">
      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-0.5 items-center text-center pb-1">
        <p className="text-stone-900 text-[15px] font-semibold leading-[1.6]">
          다음에 남길까요?
        </p>
        <p className="text-stone-500 text-[13px] font-medium leading-[1.6]">
          지금까지 쓴 내용은 저장되지 않아요.
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-2 w-full px-5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 bg-stone-200 text-stone-700 text-[15px] font-semibold rounded-xl"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 h-12 bg-stone-600 text-white text-[15px] font-semibold rounded-xl"
        >
          나가기
        </button>
      </div>
    </div>
  );
}
