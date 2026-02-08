"use client";

import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { EMOTION_SCORES } from "@/constants/constants";
import type { WriteFormData } from "./ConfigSections";

interface ImpactScoreSectionProps {
  register: UseFormRegister<WriteFormData>;
  watch: UseFormWatch<WriteFormData>;
}

export function ImpactScoreSection({
  register,
  watch,
}: ImpactScoreSectionProps) {
  const score = watch("score");
  const currentScoreData = EMOTION_SCORES[score - 1];

  return (
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
  );
}
