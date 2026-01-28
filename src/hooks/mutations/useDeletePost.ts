import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/lib/api";
import { postKeys } from "@/hooks/queries/usePosts";

interface UseDeletePostOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeletePost(options?: UseDeletePostOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // 페이지 이동 등 콜백을 먼저 실행 (캐시 무효화 전에 페이지 이동해야 함)
      options?.onSuccess?.();
      // 게시글 관련 쿼리 모두 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
