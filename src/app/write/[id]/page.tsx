"use client";

import { useParams } from "next/navigation";
import { Header, AsyncBoundary, WriteForm } from "@/components";
import { useSuspensePost } from "@/hooks/queries/usePosts";

export default function EditPostPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <AsyncBoundary
      pendingFallback={<EditPostSkeleton />}
      rejectedFallback={({ reset }) => <EditPostError onRetry={reset} />}
    >
      <EditPostContent postId={id} />
    </AsyncBoundary>
  );
}

function EditPostContent({ postId }: { postId: number }) {
  const { data: postData } = useSuspensePost(postId);

  return <WriteForm postId={postId} initialData={postData} />;
}

function EditPostSkeleton() {
  return (
    <div className="min-h-screen flex justify-center w-full bg-stone-50">
      <div className="mx-6 w-full max-w-[684px] h-full">
        <div className="flex justify-between items-center h-14">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-4" />
        </div>
        <div className="flex justify-center mt-10 mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="w-full h-[150px] bg-gray-200 rounded-[20px] animate-pulse" />
          <div className="w-full h-40 bg-gray-200 rounded-[20px] animate-pulse" />
          <div className="w-full h-32 bg-gray-200 rounded-[20px] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function EditPostError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-stone-50">
      <Header />
      <p className="text-gray-500">기록을 불러오는데 실패했습니다.</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
      >
        다시 시도
      </button>
    </div>
  );
}
