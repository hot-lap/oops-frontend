"use client";

interface WriteFormSubmitButtonProps {
  isPending: boolean;
  isEditMode: boolean;
  onSubmit: () => void;
}

export function WriteFormSubmitButton({
  isPending,
  isEditMode,
  onSubmit,
}: WriteFormSubmitButtonProps) {
  return (
    <div className="w-full flex justify-center fixed bottom-5 px-6">
      <button
        onClick={onSubmit}
        disabled={isPending}
        className={`w-full max-w-[684px] py-4 rounded-xl ${
          isPending ? "bg-stone-300 cursor-not-allowed" : "bg-stone-600"
        }`}
      >
        {isPending ? (
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
  );
}
