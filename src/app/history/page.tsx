"use client";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import { AsyncBoundary, GNB, SummaryCard } from "@/components";
import {
  useSuspenseInfinitePosts,
  useSuspenseWeekPosts,
} from "@/hooks/queries/usePosts";
import type { FormattedPost } from "@/lib/utils/postFormatter";
import { formatPostResponses, formatPosts } from "@/lib/utils/postFormatter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <GNB />
      <AsyncBoundary
        pendingFallback={<HistoryListSkeleton />}
        rejectedFallback={({ reset }) => <HistoryListError onRetry={reset} />}
      >
        <HistoryContent />
      </AsyncBoundary>
    </div>
  );
}

// 실제 데이터를 fetch하고 렌더링하는 컴포넌트
function HistoryContent() {
  const router = useRouter();
  const { userType, logout, deleteAccount } = useAuthStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleLogout = async () => {
    await logout();
    toast.success("로그아웃 되었습니다.");
    router.replace("/");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success("탈퇴가 완료되었습니다.");
      router.replace("/");
    } catch {
      // BFF에서 에러 처리됨
    }
  };

  const handleCardClick = (id: number) => {
    if (expandedId === id) {
      router.push(`/history/${id}`);
    } else {
      setExpandedId(id);
    }
  };

  // Suspense 버전 - data는 항상 존재
  const { data: weekData } = useSuspenseWeekPosts();
  const {
    data: pastData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfinitePosts(false);

  // 이번주 게시글 포맷팅
  const records: FormattedPost[] = useMemo(() => {
    return formatPosts(weekData.posts);
  }, [weekData]);

  // 과거 게시글 포맷팅
  const pastRecords: FormattedPost[] = useMemo(() => {
    return pastData.pages.flatMap((page) => formatPostResponses(page.content));
  }, [pastData]);

  const summary = weekData.summary;

  return (
    <main className="flex flex-1 justify-center px-4 pt-3 pb-8">
      <div className="flex w-full max-w-[684px] flex-col items-center">
        {/* Recent Records Section */}
        <section aria-labelledby="recent-records-title" className="w-full">
          <h2 id="recent-records-title" className="sr-only">
            최근 기록
          </h2>
          {records.length > 0 && (
            <ul className="flex w-full flex-col items-center gap-2">
              {records.map((record) => (
                <li key={record.id} className="w-full">
                  <Link href={`/history/${record.id}`}>
                    <RecordCardContent
                      date={record.date}
                      title={record.title}
                      tags={record.tags}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Summary */}
        <div className="mt-2 w-full">
          <SummaryCard
            isEmpty={records.length === 0}
            recordCount={records.length}
            topCategory={summary.category ?? null}
          />
        </div>

        {/* Past Records Section */}
        {pastRecords.length > 0 && (
          <section aria-labelledby="past-records-title" className="mt-5 w-full">
            <div className="flex w-full flex-col items-center gap-5">
              {/* Divider */}
              <div className="flex gap-1" role="separator" aria-hidden="true">
                <span className="size-1 rounded-full bg-gray-300" />
                <span className="size-1 rounded-full bg-gray-300" />
                <span className="size-1 rounded-full bg-gray-300" />
              </div>

              <h2
                id="past-records-title"
                className="w-full text-center text-[13px] font-medium leading-[1.6] text-gray-700"
              >
                아래 기록들은 충분히 지나간 일일 수도 있어요
              </h2>
            </div>

            <ul className="mt-5 flex w-full flex-col items-center gap-2">
              {pastRecords.map((record) => (
                <li key={record.id} className="w-full">
                  {/* Mobile: Link to detail page */}
                  <Link
                    href={`/history/${record.id}`}
                    className="block lg:hidden"
                  >
                    <PastRecordContent
                      date={record.date}
                      title={record.title}
                    />
                  </Link>
                  {/* Desktop: Expandable card */}
                  <div className="hidden lg:block">
                    <ExpandablePastRecord
                      record={record}
                      isExpanded={expandedId === record.id}
                      onClick={() => handleCardClick(record.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>

            {/* Infinite Scroll Trigger */}
            <InfiniteScrollTrigger
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </section>
        )}
        {userType === "user" && (
          <section>
            <div className="h-[64px] w-full" />
            <div className="flex gap-4 text-[13px] font-medium leading-[1.6] text-gray-400 underline">
              <button
                onClick={handleLogout}
                className="transition-colors hover:text-gray-700"
              >
                로그아웃
              </button>
              <button
                onClick={handleDeleteAccount}
                className="transition-colors hover:text-gray-700"
              >
                탈퇴하기
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function RecordCardContent({
  date,
  title,
  tags,
}: {
  date: string;
  title: string;
  tags: string[];
}) {
  return (
    <article className="flex w-full flex-col gap-1 rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-gray-300">
      <div className="flex w-full flex-col gap-1 px-0.5 leading-[1.6]">
        <time className="text-[13px] text-gray-500">{date}</time>
        <h3 className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold text-gray-900">
          {title}
        </h3>
      </div>
      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-2" aria-label="태그 목록">
          {tags.map((tag, index) => (
            <li
              key={index}
              className="flex items-center justify-center rounded-full bg-gray-200 px-2 py-0.5"
            >
              <span className="text-xs leading-[1.6] text-gray-700">{tag}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function PastRecordContent({ date, title }: { date: string; title: string }) {
  return (
    <article className="flex w-full items-center gap-2.5 rounded-xl border border-gray-100 bg-white py-2.5 pl-4 pr-3 transition-colors hover:bg-gray-50">
      <div className="flex flex-1 min-w-0 items-center gap-3 leading-[1.6]">
        <time className="shrink-0 text-[13px] text-gray-500">{date}</time>
        <h3 className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-medium text-gray-700">
          {title}
        </h3>
      </div>
      <ChevronDownIcon className="size-[18px] shrink-0" aria-hidden="true" />
    </article>
  );
}

function ExpandablePastRecord({
  record,
  isExpanded,
  onClick,
}: {
  record: FormattedPost;
  isExpanded: boolean;
  onClick: () => void;
}) {
  return (
    <article className="w-full rounded-xl border border-gray-100 bg-white transition-colors hover:border-gray-300">
      {/* Header button */}
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isExpanded}
        className={`flex w-full cursor-pointer items-center gap-2.5 ${isExpanded ? "px-4 pt-4" : "py-2.5 pl-4 pr-3"}`}
      >
        <div className="flex flex-1 min-w-0 items-center gap-3 leading-[1.6]">
          <time className="shrink-0 text-[13px] text-gray-500">
            {record.date}
          </time>
          {!isExpanded && (
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-[15px] font-medium text-gray-700">
              {record.title}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDownIcon className="size-[18px]" aria-hidden="true" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Link
              href={`/history/${record.id}`}
              className="flex flex-col gap-1 px-4 pb-4"
            >
              <h3 className="overflow-hidden text-ellipsis whitespace-nowrap pl-0.5 text-left text-[15px] font-medium leading-[1.6] text-gray-900">
                {record.title}
              </h3>
              {record.tags.length > 0 && (
                <ul
                  className="flex flex-wrap gap-2 pt-2"
                  aria-label="태그 목록"
                >
                  {record.tags.map((tag, i) => (
                    <li
                      key={i}
                      className="rounded-full bg-gray-200 px-2 py-0.5"
                    >
                      <span className="text-xs leading-[1.6] text-gray-700">
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function InfiniteScrollTrigger({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "100px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div ref={triggerRef} className="mt-4 flex w-full justify-center">
      {isFetchingNextPage && (
        <div className="size-5 animate-spin rounded-full border-t-2 border-b-2 border-gray-400" />
      )}
    </div>
  );
}

// 로딩 스켈레톤
function HistoryListSkeleton() {
  return (
    <main className="flex flex-1 justify-center px-4 pt-3 pb-8">
      <div className="flex w-full max-w-[684px] flex-col items-center gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 w-full animate-pulse rounded-xl bg-gray-200"
          />
        ))}
        <div className="mt-2 h-20 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    </main>
  );
}

// 에러 UI
function HistoryListError({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-8">
      <p className="text-gray-500">기록을 불러오는데 실패했습니다.</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        다시 시도
      </button>
    </main>
  );
}
