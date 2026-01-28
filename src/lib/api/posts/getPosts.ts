import { apiClient } from "../client";
import type { PagePostResponse } from "@/types/api/posts";

/**
 * 게시글 페이징 조회
 */
export async function getPosts(
  page: number,
  size: number = 10,
  includeThisWeek: boolean = false,
): Promise<PagePostResponse> {
  const response = await apiClient
    .get("api/v1/posts", {
      searchParams: { page, size, includeThisWeek },
    })
    .json<PagePostResponse>();

  return response;
}
