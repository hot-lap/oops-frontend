import { apiClient, type ApiResponse } from "../client";
import type { PostResponse, PostCreateRequest } from "@/types/api/posts";

/**
 * 게시글 생성
 */
export async function createPost(
  data: PostCreateRequest,
): Promise<PostResponse> {
  const response = await apiClient
    .post("api/v1/posts", { json: data })
    .json<ApiResponse<PostResponse>>();

  return response.data;
}
