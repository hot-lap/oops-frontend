"use client";

import Image from "next/image";

interface WriteFormHeaderProps {
  selectedDate: Date | null;
  onBackClick: () => void;
  onCalendarClick: () => void;
}

export function WriteFormHeader({
  selectedDate,
  onBackClick,
  onCalendarClick,
}: WriteFormHeaderProps) {
  const dateLabel = selectedDate
    ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`
    : "날짜 선택";

  return (
    <div className="flex justify-between items-center h-14">
      <button onClick={onBackClick} className="text-xl">
        <Image
          src="/icons/chevron-left.svg"
          alt="left"
          width={24}
          height={24}
        />
      </button>

      <button
        className="flex items-center gap-2 cursor-pointer"
        onClick={onCalendarClick}
      >
        <h2 className="text-md font-semibold">{dateLabel}</h2>
        <Image
          src="/icons/chevron-down.svg"
          alt="toggle-calendar"
          width={17}
          height={17}
        />
      </button>

      <div className="w-4" />
    </div>
  );
}
