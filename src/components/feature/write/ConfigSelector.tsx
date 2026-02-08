"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

// ============================================
// Root Component
// ============================================

interface ConfigSelectorProps {
  children: ReactNode;
  className?: string;
}

function ConfigSelectorRoot({ children, className = "" }: ConfigSelectorProps) {
  return <div className={className}>{children}</div>;
}

// ============================================
// Section Component
// ============================================

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

function Section({ title, children, className = "" }: SectionProps) {
  return (
    <div
      className={`bg-white p-5 rounded-[20px] outline outline-1 outline-stone-200 ${className}`}
    >
      <div className="justify-start text-stone-900 text-base font-semibold leading-6 mb-4">
        {title}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

interface ChipGroupProps {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}

function ChipGroup({ items, selected, onToggle }: ChipGroupProps) {
  return (
    <>
      {items.map((item) => (
        <Chip
          key={item}
          selected={selected.includes(item)}
          onClick={() => onToggle(item)}
        >
          {item}
        </Chip>
      ))}
    </>
  );
}

// ============================================
// Chip Component
// ============================================

interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

function Chip({ children, selected = false, onClick }: ChipProps) {
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
      {children}
    </button>
  );
}

// ============================================
// CustomChips Component
// ============================================

interface CustomChipsProps {
  items: string[];
  onRemove: (item: string) => void;
}

function CustomChips({ items, onRemove }: CustomChipsProps) {
  return (
    <>
      {items.map((item) => (
        <div
          key={`custom-${item}`}
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-stone-600 text-white text-[15px] leading-[1.6]"
        >
          <span>#{item}</span>
          <button
            type="button"
            onClick={() => onRemove(item)}
            className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
            aria-label={`${item} 삭제`}
          >
            <X size={8} strokeWidth={2} />
          </button>
        </div>
      ))}
    </>
  );
}

// ============================================
// CustomInput Component
// ============================================

interface CustomInputProps {
  onAdd: (value: string) => void;
  placeholder?: string;
  buttonLabel?: string;
}

function CustomInput({
  onAdd,
  placeholder = "입력",
  buttonLabel = "직접 입력",
}: CustomInputProps) {
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

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setInputValue("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-stone-600">
        <span className="text-[15px] leading-[1.6] text-white select-none">
          #
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          maxLength={12}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleComplete}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-20 text-[15px] leading-[1.6] text-white placeholder-white/50 caret-white outline-none bg-transparent"
        />
        <button
          type="button"
          onMouseDown={handleCancel}
          className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
          aria-label="입력 취소"
        >
          <X size={8} strokeWidth={2} className="text-white" />
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
      {buttonLabel}
    </button>
  );
}

// ============================================
// Compound Component Export
// ============================================

export const ConfigSelector = Object.assign(ConfigSelectorRoot, {
  Section,
  ChipGroup,
  Chip,
  CustomChips,
  CustomInput,
});
