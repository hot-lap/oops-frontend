import { apiClient, type ApiResponse } from "../client";
import type { PostWeekResponse } from "@/types/api/posts";

/**
 * 이번주 게시글 및 요약 통계 조회
 */
export async function getWeekPosts(): Promise<PostWeekResponse> {
  const response = await apiClient
    .get("api/v1/posts/weeks")
    .json<ApiResponse<PostWeekResponse>>();

  return response.data;
}
