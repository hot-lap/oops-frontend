"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import EditIcon from "@/assets/icons/edit.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import { useModalStore } from "@/stores/useModalStore";
import { useDeletePost } from "@/hooks/mutations/useDeletePost";
import { Tag } from "./Tag";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface RecordDetailProps {
  postId: number;
  emoji: string | StaticImageData;
  datetime: string;
  content: string;
  tags: string[];
  lastModified?: string;
}

export function RecordDetail({
  postId,
  emoji,
  datetime,
  content,
  tags,
  lastModified,
}: RecordDetailProps) {
  const router = useRouter();
  const { showModal, hideModal } = useModalStore();
  const { mutate: deletePost, isPending } = useDeletePost({
    onSuccess: () => {
      hideModal();
    },
  });

  const handleEdit = () => {
    router.push(`/write/${postId}`);
  };

  const handleDelete = () => {
    showModal({
      component: DeleteConfirmModal,
      props: {
        onConfirm: () => {
          deletePost(postId);
        },
        isPending,
      },
    });
  };

  return (
    <article className="flex h-full w-full flex-col items-center overflow-hidden rounded-xl border border-white bg-white lg:h-[640px]">
      {/* Header */}
      <header className="flex h-14 w-full items-center justify-between p-4">
        <div className="size-6" aria-hidden="true" />
        <nav aria-label="기록 관리">
          <ul className="flex items-center gap-2">
            <li>
              <button
                onClick={handleEdit}
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
          </ul>
        </nav>
      </header>

      {/* Emoji */}
      <figure className="relative size-20 overflow-hidden rounded-full">
        <Image
          src={emoji}
          alt="기록 이모지"
          fill
          className="object-cover"
          unoptimized
        />
      </figure>

      {/* Datetime */}
      <h2 className="mt-4 w-full text-center text-[15px] font-semibold leading-[1.6] text-gray-900">
        <time>{datetime}</time>
      </h2>

      {/* Content */}
      <blockquote className="mx-6 mt-4 min-h-40 w-[calc(100%-48px)] rounded-[20px] border border-gray-200 bg-white p-5">
        <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.6] text-gray-700">
          {content}
        </p>
      </blockquote>

      {/* Tags */}
      {tags.length > 0 && (
        <ul
          className="mt-4 flex w-full flex-wrap gap-2 px-6"
          aria-label="태그 목록"
        >
          {tags.map((tag, index) => (
            <li key={index}>
              <Tag label={tag} />
            </li>
          ))}
        </ul>
      )}

      {/* Last Modified */}
      {lastModified && (
        <footer className="mt-4 w-full px-6">
          <p className="text-xs leading-[1.6] text-gray-500">
            최종 수정: <time>{lastModified}</time>
          </p>
        </footer>
      )}
    </article>
  );
}
