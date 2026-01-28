import { apiClient, type ApiResponse } from "../client";
import type { PostResponse, PostUpdateRequest } from "@/types/api/posts";

/**
 * 게시글 수정
 */
export async function updatePost(
  postId: number,
  data: PostUpdateRequest,
): Promise<PostResponse> {
  const response = await apiClient
    .put(`api/v1/posts/${postId}`, { json: data })
    .json<ApiResponse<PostResponse>>();

  return response.data;
}
