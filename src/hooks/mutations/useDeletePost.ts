import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/lib/api/posts";
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
      // 게시글 관련 쿼리 모두 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
