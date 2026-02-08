"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import type { WriteFormData } from "./ConfigSections";

interface DescriptionInputProps {
  register: UseFormRegister<WriteFormData>;
  errors: FieldErrors<WriteFormData>;
}

export function DescriptionInput({ register, errors }: DescriptionInputProps) {
  return (
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
  );
}
