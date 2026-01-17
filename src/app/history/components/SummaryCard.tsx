import DocIcon from "@/assets/icons/doc.svg";

interface SummaryCardProps {
  recordCount: number;
  topCategory: string | null;
  isEmpty?: boolean;
}

export default function SummaryCard({
  recordCount,
  topCategory,
  isEmpty = false,
}: SummaryCardProps) {
  return (
    <aside
      className="flex w-full items-center gap-4 rounded-xl border border-gray-100 bg-white py-5 pl-5 pr-4"
      aria-label="기록 요약"
    >
      <DocIcon className="size-9" aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-1 text-[13px] leading-[1.6] text-gray-900">
        <strong className="font-bold">요약</strong>
        {isEmpty ? (
          <p>이번 주에는 아직 기록이 없어요.</p>
        ) : (
          <div className="flex flex-col">
            <p className="overflow-hidden whitespace-nowrap">
              이번 주에 <strong className="font-bold">{recordCount}번</strong>{" "}
              기록했어요.
            </p>
            {topCategory && (
              <p className="overflow-hidden">
                가장 많이 기록한 유형은{" "}
                <strong className="font-bold">{topCategory}</strong>
                이에요.
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
