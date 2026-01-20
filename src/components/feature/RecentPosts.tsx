"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSuspenseHome } from "@/hooks/queries/useHome";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "M월 d일 (E)", { locale: ko });
}

export function RecentPosts() {
  const router = useRouter();
  const { data } = useSuspenseHome();
  const recentPost = data.posts[0];

  if (!recentPost) {
    return null;
  }

  const handleClick = () => {
    router.push(`/history/`);
  };

  return (
    <div className="w-full flex flex-col gap-3 items-center px-6">
      <p className="text-stone-500 text-[13px] leading-[1.6]">최근 기록</p>
      <button
        onClick={handleClick}
        className="w-full bg-white flex items-center gap-2.5 pl-4 pr-3 py-2.5 rounded-xl shadow-[0px_4px_10px_0px_rgba(87,83,78,0.15)] text-left"
      >
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className="text-stone-500 text-[13px] leading-[1.6] shrink-0">
            {formatPostDate(recentPost.postedAt)}
          </span>
          <span className="text-stone-700 text-[15px] font-medium leading-[1.6] truncate">
            {recentPost.content}
          </span>
        </div>
        <Image
          src="/icons/chevron-right.svg"
          alt="chevron-right"
          width={18}
          height={18}
          className="shrink-0"
        />
      </button>
    </div>
  );
}
