import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "@/lib/api/posts";
import { postKeys } from "@/hooks/queries/usePosts";
import type { PostUpdateRequest } from "@/types/api/posts";

interface UseUpdatePostOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUpdatePost(options?: UseUpdatePostOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: PostUpdateRequest;
    }) => updatePost(postId, data),
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
