"use client";

import { useParams, useRouter } from "next/navigation";
import EditIcon from "@/assets/icons/edit.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import {
  Header,
  AsyncBoundary,
  DeleteConfirmModal,
  RecordContent,
} from "@/components";
import { useModalStore } from "@/stores/useModalStore";
import { useSuspensePost } from "@/hooks/queries/usePosts";
import { useDeletePost } from "@/hooks/mutations/useDeletePost";
import { formatPostResponse } from "@/lib/utils/postFormatter";

export default function HistoryDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <AsyncBoundary
        pendingFallback={<HistoryDetailSkeleton />}
        rejectedFallback={({ reset }) => <HistoryDetailError onRetry={reset} />}
      >
        <HistoryDetailContent postId={id} />
      </AsyncBoundary>
    </div>
  );
}

// 실제 데이터를 fetch하고 렌더링하는 컴포넌트
function HistoryDetailContent({ postId }: { postId: number }) {
  const router = useRouter();
  const { showModal, hideModal } = useModalStore();

  // Suspense 버전 - data는 항상 존재
  const { data: postData } = useSuspensePost(postId);
  const record = formatPostResponse(postData);

  const { mutate: deletePost, isPending } = useDeletePost({
    onSuccess: () => {
      hideModal(true);
      router.replace("/history");
    },
  });

  const handleBack = () => {
    router.push("/history");
  };

  const handleEdit = () => {
    router.push(`/write/${postId}`);
  };

  const handleDelete = () => {
    showModal({
      component: DeleteConfirmModal,
      props: {
        onConfirm: () => deletePost(postId),
        isPending,
      },
    });
  };

  return (
    <>
      <Header
        onBack={handleBack}
        rightActions={
          <>
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
          </>
        }
      />

      <main className="flex flex-1 flex-col items-center px-4 pb-8">
        <article className="flex w-full max-w-[532px] flex-col items-center">
          <RecordContent
            emoji={record.emoji}
            datetime={record.datetime}
            content={record.content}
            tags={record.tags}
            lastModified={record.lastModified}
          />
        </article>
      </main>
    </>
  );
}

// 로딩 스켈레톤
function HistoryDetailSkeleton() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center px-4 pb-8">
        <div className="flex w-full max-w-[532px] flex-col items-center">
          <div className="size-20 animate-pulse rounded-full bg-gray-200" />
          <div className="mt-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 min-h-40 w-full animate-pulse rounded-[20px] bg-gray-200" />
        </div>
      </main>
    </>
  );
}

// 에러 UI
function HistoryDetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 pb-8">
        <p className="text-gray-500">기록을 불러오는데 실패했습니다.</p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          다시 시도
        </button>
      </main>
    </>
  );
}
