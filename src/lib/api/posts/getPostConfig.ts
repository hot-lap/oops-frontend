import { apiClient, type ApiResponse } from "../client";
import type { PostConfig } from "@/types/api/posts";

/**
 * 게시글 Config 조회 (유형, 원인, 감정 목록)
 */
export async function getPostConfig(): Promise<PostConfig> {
  const response = await apiClient
    .get("api/v1/posts/configs")
    .json<ApiResponse<PostConfig>>();

  return response.data;
}
