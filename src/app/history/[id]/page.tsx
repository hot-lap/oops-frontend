"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import EditIcon from "@/assets/icons/edit.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import Header from "@/components/common/Header";
import { useModalStore } from "@/stores/useModalStore";
import { Tag, DeleteConfirmModal } from "../components";
import { getRecordById } from "../data";

export default function HistoryDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { showModal } = useModalStore();

  const record = getRecordById(id);

  const handleDelete = () => {
    showModal({
      component: DeleteConfirmModal,
      props: {},
    });
  };

  if (!record) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <Header
        rightActions={
          <>
            <li>
              <button
                aria-label="수정하기"
                className="flex size-6 items-center justify-center"
              >
                <EditIcon className="size-6" />
              </button>
            </li>
            <li>
              <button
                onClick={handleDelete}
                aria-label="삭제하기"
                className="flex size-6 items-center justify-center"
              >
                <TrashIcon className="size-6" />
              </button>
            </li>
          </>
        }
      />

      <main className="flex flex-1 flex-col items-center px-4 pb-8">
        <article className="flex w-full max-w-[532px] flex-col items-center">
          {/* Emoji */}
          <figure className="relative size-20 overflow-hidden rounded-full">
            <Image
              src={record.emoji}
              alt="기록 이모지"
              fill
              className="object-cover"
              unoptimized
            />
          </figure>

          {/* Date as title */}
          <h1 className="mt-4 text-center text-[15px] font-semibold leading-[1.6] text-gray-900">
            <time>{record.date}</time>
          </h1>

          {/* Content */}
          <blockquote className="mt-4 min-h-40 w-full rounded-[20px] border border-gray-200 bg-white p-5">
            <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.6] text-gray-700">
              {record.content}
            </p>
          </blockquote>

          {/* Tags */}
          {record.tags.length > 0 && (
            <ul
              className="mt-4 flex w-full flex-wrap gap-2"
              aria-label="태그 목록"
            >
              {record.tags.map((tag, index) => (
                <li key={index}>
                  <Tag label={tag} />
                </li>
              ))}
            </ul>
          )}

          {/* Last Modified */}
          {record.lastModified && (
            <footer className="mt-4 w-full">
              <p className="text-xs leading-[1.6] text-gray-500">
                최종 수정: <time>{record.lastModified}</time>
              </p>
            </footer>
          )}
        </article>
      </main>
    </div>
  );
}
