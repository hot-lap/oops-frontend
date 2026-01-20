"use client";

import { useSuspensePostConfig } from "@/hooks/queries/usePosts";

interface ConfigSelectorProps {
  selectedCategories: string[];
  selectedCauses: string[];
  selectedFeelings: string[];
  onToggleCategory: (value: string, multipleSelectable: boolean) => void;
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

export function ConfigSelector({
  selectedCategories,
  selectedCauses,
  selectedFeelings,
  onToggleCategory,
  onToggleCause,
  onToggleFeeling,
}: ConfigSelectorProps) {
  const { data: config } = useSuspensePostConfig();

  return (
    <>
      {/* 유형 */}
      <div className="bg-white p-5 rounded-[20px] outline outline-1 outline-stone-200">
        <div className="justify-start text-stone-900 text-base font-semibold leading-6 mb-4">
          유형
        </div>
        <div className="flex flex-wrap gap-2">
          {config.category.categories.map((item) => (
            <ChipButton
              key={item}
              label={item}
              selected={selectedCategories.includes(item)}
              onClick={() =>
                onToggleCategory(item, config.category.multipleSelectable)
              }
            />
          ))}
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
