"use client";

import { useState, useRef, useEffect } from "react";
import { useSuspensePostConfig } from "@/hooks/queries/usePosts";

interface ConfigSelectorProps {
  selectedCategories: string[];
  customCategories: string[];
  selectedCauses: string[];
  selectedFeelings: string[];
  onToggleCategory: (value: string, multipleSelectable: boolean) => void;
  onAddCustomCategory: (value: string) => void;
  onRemoveCustomCategory: (value: string) => void;
  onToggleCause: (value: string, multipleSelectable: boolean) => void;
  onToggleFeeling: (value: string, multipleSelectable: boolean) => void;
}

function ChipButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-[15px] leading-[1.6] ${
        selected
          ? "bg-stone-600 text-white"
          : "bg-white text-stone-900 outline outline-1 outline-offset-[-1px] outline-stone-200"
      }`}
    >
      {label}
    </button>
  );
}

// 커스텀 카테고리 칩 (X 버튼 포함)
function CustomCategoryChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-stone-600 text-white text-[15px] leading-[1.6]">
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
        aria-label={`${label} 삭제`}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path
            d="M1 1L7 7M7 1L1 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

// 직접 입력 버튼 및 입력 필드
function CustomCategoryInput({ onAdd }: { onAdd: (value: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleComplete = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAdd(trimmed);
    }
    setInputValue("");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleComplete();
    } else if (e.key === "Escape") {
      setInputValue("");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 px-3 py-2 rounded-full outline outline-1 outline-offset-[-1px] outline-stone-600 bg-white">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleComplete}
          onKeyDown={handleKeyDown}
          placeholder="입력"
          className="w-20 text-[15px] leading-[1.6] text-stone-900 outline-none bg-transparent"
        />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setInputValue("");
            setIsEditing(false);
          }}
          className="w-4 h-4 flex items-center justify-center rounded-full bg-stone-300 hover:bg-stone-400"
          aria-label="입력 취소"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path
              d="M1 1L7 7M7 1L1 7"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="px-3 py-2 rounded-full text-[15px] leading-[1.6] bg-white text-stone-900 outline outline-1 outline-offset-[-1px] outline-stone-200"
    >
      직접 입력
    </button>
  );
}

export function ConfigSelector({
  selectedCategories,
  customCategories,
  selectedCauses,
  selectedFeelings,
  onToggleCategory,
  onAddCustomCategory,
  onRemoveCustomCategory,
  onToggleCause,
  onToggleFeeling,
}: ConfigSelectorProps) {
  const { data: config } = useSuspensePostConfig();

  // "직접 입력"을 제외한 카테고리 목록
  const regularCategories = config.category.categories.filter(
    (item) => item !== "직접 입력",
  );

  return (
    <>
      {/* 유형 */}
      <div className="bg-white p-5 rounded-[20px] outline outline-1 outline-stone-200">
        <div className="justify-start text-stone-900 text-base font-semibold leading-6 mb-4">
          유형
        </div>
        <div className="flex flex-wrap gap-2">
          {regularCategories.map((item) => (
            <ChipButton
              key={item}
              label={item}
              selected={selectedCategories.includes(item)}
              onClick={() =>
                onToggleCategory(item, config.category.multipleSelectable)
              }
            />
          ))}
          {/* 커스텀 카테고리 칩들 */}
          {customCategories.map((item) => (
            <CustomCategoryChip
              key={`custom-${item}`}
              label={item}
              onRemove={() => onRemoveCustomCategory(item)}
            />
          ))}
          {/* 직접 입력 버튼 */}
          <CustomCategoryInput onAdd={onAddCustomCategory} />
        </div>
      </div>

      {/* 원인 */}
      <div className="bg-white p-5 rounded-[20px] outline outline-1 outline-stone-200">
        <div className="justify-start text-stone-900 text-base font-semibold leading-6 mb-4">
          원인
        </div>
        <div className="flex flex-wrap gap-2">
          {config.cause.causes.map((item) => (
            <ChipButton
              key={item}
              label={item}
              selected={selectedCauses.includes(item)}
              onClick={() =>
                onToggleCause(item, config.cause.multipleSelectable)
              }
            />
          ))}
        </div>
      </div>

      {/* 감정 */}
      <div className="bg-white p-5 mb-25 rounded-[20px] outline outline-1 outline-stone-200">
        <div className="justify-start text-stone-900 text-base font-semibold leading-6 mb-4">
          감정
        </div>
        <div className="flex flex-wrap gap-2">
          {config.feeling.feelings.map((item) => (
            <ChipButton
              key={item}
              label={item}
              selected={selectedFeelings.includes(item)}
              onClick={() =>
                onToggleFeeling(item, config.feeling.multipleSelectable)
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
