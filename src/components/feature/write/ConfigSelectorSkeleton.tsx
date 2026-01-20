import { Skeleton } from "@/components";

function ChipSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rounded" className="h-10 w-20" />
      ))}
    </div>
  );
}

export function ConfigSelectorSkeleton() {
  return (
    <>
      {/* 유형 */}
      <div className="bg-white p-5 rounded-[20px] outline outline-1 outline-stone-200">
        <div className="justify-start text-stone-900 text-base font-semibold leading-6 mb-4">
          유형
        </div>
        <ChipSkeleton count={5} />
      </div>

      {/* 원인 */}
      <div className="bg-white p-5 rounded-[20px] outline outline-1 outline-stone-200">
        <div className="justify-start text-stone-900 text-base font-semibold leading-6 mb-4">
          원인
        </div>
        <ChipSkeleton count={6} />
      </div>

      {/* 감정 */}
      <div className="bg-white p-5 mb-25 rounded-[20px] outline outline-1 outline-stone-200">
        <div className="justify-start text-stone-900 text-base font-semibold leading-6 mb-4">
          감정
        </div>
        <ChipSkeleton count={6} />
      </div>
    </>
  );
}
