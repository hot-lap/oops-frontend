"use client";

import { useWatch, Control, UseFormSetValue } from "react-hook-form";
import toast from "react-hot-toast";
import { useSuspensePostConfig } from "@/hooks/queries/usePosts";
import { ConfigSelector } from "./ConfigSelector";

export type WriteFormData = {
  description: string;
  score: number;
  categories: string[];
  customCategories: string[];
  causes: string[];
  feelings: string[];
  date: Date | null;
};

interface ConfigSectionsProps {
  control: Control<WriteFormData>;
  setValue: UseFormSetValue<WriteFormData>;
}

export function ConfigSections({ control, setValue }: ConfigSectionsProps) {
  const { data: config } = useSuspensePostConfig();
  const selectedCategories = useWatch({ control, name: "categories" }) ?? [];
  const customCategories =
    useWatch({ control, name: "customCategories" }) ?? [];
  const selectedCauses = useWatch({ control, name: "causes" }) ?? [];
  const selectedFeelings = useWatch({ control, name: "feelings" }) ?? [];

  const regularCategories = config.category.categories.filter(
    (item) => item !== "직접 입력",
  );

  const toggleSelect = (
    field: "categories" | "causes" | "feelings",
    value: string,
    multipleSelectable: boolean,
  ) => {
    let current: string[] = [];
    if (field === "categories") current = selectedCategories;
    if (field === "causes") current = selectedCauses;
    if (field === "feelings") current = selectedFeelings;

    if (current.includes(value)) {
      setValue(
        field,
        current.filter((v) => v !== value),
      );
    } else if (multipleSelectable) {
      setValue(field, [...current, value]);
    } else {
      setValue(field, [value]);
    }
  };

  const handleAddCustomCategory = (value: string) => {
    if (customCategories.length >= 3) {
      toast.error("직접 입력은 최대 3개까지 가능해요.");
      return;
    }
    if (!customCategories.includes(value)) {
      setValue("customCategories", [...customCategories, value]);
    }
  };

  const handleRemoveCustomCategory = (value: string) => {
    setValue(
      "customCategories",
      customCategories.filter((v) => v !== value),
    );
  };

  return (
    <ConfigSelector className="flex flex-col gap-3">
      <ConfigSelector.Section title="유형">
        <ConfigSelector.ChipGroup
          items={regularCategories}
          selected={selectedCategories}
          onToggle={(item) =>
            toggleSelect("categories", item, config.category.multipleSelectable)
          }
        />
        <ConfigSelector.CustomChips
          items={customCategories}
          onRemove={handleRemoveCustomCategory}
        />
        <ConfigSelector.CustomInput onAdd={handleAddCustomCategory} />
      </ConfigSelector.Section>

      <ConfigSelector.Section title="원인">
        <ConfigSelector.ChipGroup
          items={config.cause.causes}
          selected={selectedCauses}
          onToggle={(item) =>
            toggleSelect("causes", item, config.cause.multipleSelectable)
          }
        />
      </ConfigSelector.Section>

      <ConfigSelector.Section title="감정" className="mb-25">
        <ConfigSelector.ChipGroup
          items={config.feeling.feelings}
          selected={selectedFeelings}
          onToggle={(item) =>
            toggleSelect("feelings", item, config.feeling.multipleSelectable)
          }
        />
      </ConfigSelector.Section>
    </ConfigSelector>
  );
}
