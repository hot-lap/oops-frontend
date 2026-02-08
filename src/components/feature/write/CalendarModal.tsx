"use client";

import { useState } from "react";
import { ko } from "date-fns/locale";
import { Calendar } from "@/components";
import type { ModalComponentProps } from "@/types";

interface CalendarModalProps {
  selectedDate?: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarModal({
  selectedDate,
  onSelectDate,
  onClose,
}: ModalComponentProps<CalendarModalProps>) {
  const [tempDate, setTempDate] = useState<Date | undefined>(selectedDate);

  const handleConfirm = () => {
    if (tempDate) {
      onSelectDate(tempDate);
      onClose?.();
    }
  };

  return (
    <div className="bg-white rounded-[20px] w-[calc(100vw-48px)] max-w-[448px] overflow-hidden">
      <Calendar
        mode="single"
        locale={ko}
        selected={tempDate}
        onSelect={setTempDate}
        disabled={{ after: new Date() }}
        formatters={{
          formatCaption: (date) =>
            `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
          formatWeekdayName: (date) =>
            ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
        }}
        className="w-full px-6 pt-5 pb-0 [--cell-size:24px]"
        classNames={{
          root: "w-full",
          month: "flex flex-col w-full gap-8",
          table: "w-full max-w-[400px] mx-auto border-collapse py-8",
          weekdays: "flex justify-between items-center self-stretch",
          weekday:
            "text-stone-400 font-normal text-[15px] leading-[160%] select-none text-center w-6",
          week: "flex justify-between items-center self-stretch mt-3",
          day: "relative flex items-center justify-center size-6 p-0 text-center select-none",
          outside: "text-stone-300",
          disabled: "text-stone-300 opacity-50",
          caption_label:
            "text-[15px] font-semibold text-stone-900 leading-[160%] select-none",
          nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          button_previous:
            "size-6 flex items-center justify-center text-stone-500 hover:bg-stone-100 rounded-full p-0 select-none",
          button_next:
            "size-6 flex items-center justify-center text-stone-500 hover:bg-stone-100 rounded-full p-0 select-none",
        }}
        components={{
          DayButton: ({ modifiers, ...props }) => (
            <button
              className={`size-6 flex items-center justify-center rounded-full text-[15px] font-normal leading-[160%] transition-colors ${
                modifiers.selected
                  ? "bg-stone-600 text-white"
                  : modifiers.disabled
                    ? ""
                    : "hover:bg-stone-100 text-stone-900"
              } ${modifiers.outside ? "text-stone-300" : ""}`}
              {...props}
            />
          ),
        }}
      />
      <div className="px-4 pb-5 pt-8">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-12 bg-stone-600 text-white text-[15px] font-semibold rounded-xl"
        >
          확인
        </button>
      </div>
    </div>
  );
}
