import type { ModalComponentProps } from "@/types";

interface DeleteConfirmModalProps {
  onConfirm?: () => void;
}

export default function DeleteConfirmModal({
  onClose,
  onConfirm,
}: ModalComponentProps<DeleteConfirmModalProps>) {
  return (
    <div className="flex w-[327px] flex-col items-center gap-3 overflow-hidden rounded-[20px] bg-white py-5">
      {/* Text Content */}
      <div className="flex flex-col items-center gap-0.5 pb-1 text-center leading-[1.6]">
        <h2 className="text-[15px] font-semibold text-gray-900">
          기록을 삭제할까요?
        </h2>
        <p className="w-[287px] text-[13px] font-medium text-gray-500">
          한 번 삭제하면 되돌릴 수 없어요.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex w-full items-center gap-2 px-5">
        <button
          onClick={onClose}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-gray-200 px-10 py-2.5"
        >
          <span className="text-[15px] font-semibold text-gray-700">취소</span>
        </button>
        <button
          onClick={onConfirm}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#57534e] px-10 py-2.5"
        >
          <span className="text-[15px] font-semibold text-white">삭제</span>
        </button>
      </div>
    </div>
  );
}
