import { apiClient, type ApiResponse } from "../client";
import type { PostResponse } from "@/types/api/posts";

/**
 * 게시글 상세 조회
 */
export async function getPost(postId: number): Promise<PostResponse> {
  const response = await apiClient
    .get(`api/v1/posts/${postId}`)
    .json<ApiResponse<PostResponse>>();

  return response.data;
}
