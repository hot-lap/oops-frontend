"use client";

import { useRouter } from "next/navigation";
import EditIcon from "@/assets/icons/edit.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import { useModalStore } from "@/stores/useModalStore";
import { useDeletePost } from "@/hooks/mutations/useDeletePost";
import { RecordContent } from "./RecordContent";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface RecordDetailProps {
  postId: number;
  emoji: string;
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
    <article className="flex h-full w-full flex-col items-center overflow-hidden rounded-xl border border-white bg-white px-6 lg:h-[640px]">
      {/* Header */}
      <header className="flex h-14 w-full items-center justify-between">
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

      {/* Content */}
      <RecordContent
        emoji={emoji}
        datetime={datetime}
        content={content}
        tags={tags}
        lastModified={lastModified}
      />
    </article>
  );
}
