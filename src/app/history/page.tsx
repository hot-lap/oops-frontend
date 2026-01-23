"use client";

import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import { AsyncBoundary, Header, RecordDetail, SummaryCard } from "@/components";
import {
  useSuspenseInfinitePosts,
  useSuspenseWeekPosts,
} from "@/hooks/queries/usePosts";
import type { FormattedPost } from "@/lib/utils/postFormatter";
import { formatPostResponses, formatPosts } from "@/lib/utils/postFormatter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { redirectToGoogleOAuth } from "@/lib/oauth/google";

export default function HistoryPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <Header title="조회" onBack={() => router.replace("/")} />
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
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  // 선택된 ID가 없으면 첫 번째 레코드 선택
  const effectiveSelectedId = selectedId ?? records[0]?.id ?? null;

  // 선택된 레코드 찾기
  const selectedRecord = useMemo(() => {
    if (!effectiveSelectedId) return null;
    return (
      records.find((r) => r.id === effectiveSelectedId) ||
      pastRecords.find((r) => r.id === effectiveSelectedId) ||
      null
    );
  }, [effectiveSelectedId, records, pastRecords]);

  console.log(selectedRecord);

  const summary = weekData.summary;

  return (
    <main className="flex flex-1 gap-6 px-4 pt-3 pb-8 lg:px-0">
      {/* Left Panel - Record List */}
      <div className="flex w-full flex-1 justify-center lg:justify-end lg:pl-[142px] lg:pr-12">
        <div className="flex w-full max-w-[532px] flex-col items-center">
          {/* Recent Records Section */}
          <section aria-labelledby="recent-records-title" className="w-full">
            <h2 id="recent-records-title" className="sr-only">
              최근 기록
            </h2>
            {records.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                이번주 기록이 없습니다.
              </p>
            ) : (
              <ul className="flex w-full flex-col items-center gap-2">
                {records.map((record) => (
                  <li key={record.id} className="w-full">
                    {/* Mobile: Link to detail page */}
                    <Link
                      href={`/history/${record.id}`}
                      className="block lg:hidden"
                    >
                      <RecordCardContent
                        date={record.date}
                        title={record.title}
                        tags={record.tags}
                        isSelected={false}
                      />
                    </Link>
                    {/* Desktop: Select record */}
                    <button
                      onClick={() => setSelectedId(record.id)}
                      className="hidden w-full text-left lg:block"
                      aria-pressed={effectiveSelectedId === record.id}
                    >
                      <RecordCardContent
                        date={record.date}
                        title={record.title}
                        tags={record.tags}
                        isSelected={effectiveSelectedId === record.id}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Summary */}
          <div className="mt-2 w-full">
            <SummaryCard
              recordCount={records.length}
              topCategory={summary.category ?? null}
            />
          </div>

          <button
            onClick={redirectToGoogleOAuth}
            className="mt-2 text-[13px] font-medium leading-[1.6] text-[#3878E0] underline"
          >
            로그인하고 기록 보관하기
          </button>

          {/* Past Records Section */}
          {pastRecords.length > 0 && (
            <section
              aria-labelledby="past-records-title"
              className="mt-5 w-full"
            >
              <div className="flex w-full flex-col items-center lg:gap-2">
                {/* Divider */}
                <div className="flex gap-1" role="separator" aria-hidden="true">
                  <span className="size-1 rounded-full bg-gray-300" />
                  <span className="size-1 rounded-full bg-gray-300" />
                  <span className="size-1 rounded-full bg-gray-300" />
                </div>

                <h2
                  id="past-records-title"
                  className="mt-5 w-full text-center text-[13px] font-medium leading-[1.6] text-gray-700 lg:mt-0"
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
                    {/* Desktop: Select record */}
                    <button
                      onClick={() => setSelectedId(record.id)}
                      className="hidden w-full text-left lg:block"
                      aria-pressed={effectiveSelectedId === record.id}
                    >
                      <PastRecordContent
                        date={record.date}
                        title={record.title}
                      />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Load More Button */}
              {hasNextPage && (
                <div className="mt-4 flex w-full justify-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="text-[13px] font-medium text-gray-500 underline disabled:opacity-50"
                  >
                    {isFetchingNextPage ? "로딩 중..." : "더 보기"}
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Right Panel - Record Detail (Desktop Only) */}
      <aside className="hidden flex-1 items-start lg:flex lg:pl-12 lg:pr-[142px]">
        {selectedRecord && (
          <RecordDetail
            postId={selectedRecord.id}
            emoji={selectedRecord.emoji}
            datetime={selectedRecord.datetime}
            content={selectedRecord.content}
            tags={selectedRecord.tags}
            lastModified={selectedRecord.lastModified}
          />
        )}
      </aside>
    </main>
  );
}

function RecordCardContent({
  date,
  title,
  tags,
  isSelected,
}: {
  date: string;
  title: string;
  tags: string[];
  isSelected: boolean;
}) {
  return (
    <article
      className={`flex w-full flex-col gap-1 rounded-xl border bg-white p-4 transition-colors hover:bg-gray-50 ${
        isSelected ? "border-gray-500" : "border-gray-100"
      }`}
    >
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
      <div className="flex flex-1 items-center gap-3 leading-[1.6]">
        <time className="shrink-0 text-[13px] text-gray-500">{date}</time>
        <h3 className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-medium text-gray-700">
          {title}
        </h3>
      </div>
      <ChevronDownIcon className="size-[18px]" aria-hidden="true" />
    </article>
  );
}

// 로딩 스켈레톤
function HistoryListSkeleton() {
  return (
    <main className="flex flex-1 gap-6 px-4 pt-3 pb-8 lg:px-0">
      <div className="flex w-full flex-1 justify-center lg:justify-end lg:pl-[142px] lg:pr-12">
        <div className="flex w-full max-w-[532px] flex-col items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 w-full animate-pulse rounded-xl bg-gray-200"
            />
          ))}
          <div className="mt-2 h-20 w-full animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
      <aside className="hidden flex-1 lg:flex lg:pl-12 lg:pr-[142px]">
        <div className="h-[640px] w-full animate-pulse rounded-xl bg-gray-200" />
      </aside>
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
