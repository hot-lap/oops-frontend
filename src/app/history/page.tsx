"use client";

import { useState } from "react";
import Link from "next/link";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import Header from "@/components/common/Header";
import { SummaryCard, RecordDetail } from "./components";
import { records, pastRecords, summary, getRecordById } from "./data";

export default function HistoryPage() {
  const [selectedId, setSelectedId] = useState<number | null>(
    records[0]?.id ?? null,
  );

  const selectedRecord = selectedId ? getRecordById(selectedId) : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <Header title="조회" />

      <main className="flex flex-1 gap-6 px-4 pt-3 pb-8 lg:px-0">
        {/* Left Panel - Record List */}
        <div className="flex w-full flex-1 justify-center lg:justify-end lg:pl-[142px] lg:pr-12">
          <div className="flex w-full max-w-[532px] flex-col items-center">
            {/* Recent Records Section */}
            <section aria-labelledby="recent-records-title" className="w-full">
              <h2 id="recent-records-title" className="sr-only">
                최근 기록
              </h2>
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
                      aria-pressed={selectedId === record.id}
                    >
                      <RecordCardContent
                        date={record.date}
                        title={record.title}
                        tags={record.tags}
                        isSelected={selectedId === record.id}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Summary */}
            <div className="mt-2 w-full">
              <SummaryCard
                recordCount={summary.recordCount}
                topCategory={summary.topCategory}
              />
            </div>

            <Link
              href="#"
              className="mt-2 text-[13px] font-medium leading-[1.6] text-[#3878E0] underline"
            >
              로그인하고 기록 보관하기
            </Link>

            {/* Past Records Section */}
            {pastRecords.length > 0 && (
              <section
                aria-labelledby="past-records-title"
                className="mt-5 w-full"
              >
                <div className="flex w-full flex-col items-center lg:gap-2">
                  {/* Divider */}
                  <div
                    className="flex gap-1"
                    role="separator"
                    aria-hidden="true"
                  >
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
                        aria-pressed={selectedId === record.id}
                      >
                        <PastRecordContent
                          date={record.date}
                          title={record.title}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        {/* Right Panel - Record Detail (Desktop Only) */}
        <aside className="hidden flex-1 items-start lg:flex lg:pl-12 lg:pr-[142px]">
          {selectedRecord && (
            <RecordDetail
              emoji={selectedRecord.emoji}
              datetime={selectedRecord.datetime}
              content={selectedRecord.content}
              tags={selectedRecord.tags}
              lastModified={selectedRecord.lastModified}
            />
          )}
        </aside>
      </main>
    </div>
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
