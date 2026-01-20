import { apiClient } from "./client";
import type {
  ApiResponse,
  PostResponse,
  PostWeekResponse,
  PagePostResponse,
  PostConfig,
  PostCreateRequest,
} from "@/types/api/posts";

// 이번주 게시글 및 요약 통계 조회
export async function getWeekPosts(): Promise<PostWeekResponse> {
  const response = await apiClient.get<ApiResponse<PostWeekResponse>>(
    "/api/v1/posts/weeks",
  );
  return response.data;
}

// 게시글 페이징 조회
export async function getPosts(
  page: number,
  size: number = 10,
  includeThisWeek: boolean = false,
): Promise<PagePostResponse> {
  const response = await apiClient.get<PagePostResponse>("/api/v1/posts", {
    page,
    size,
    includeThisWeek,
  });
  return response;
}

// 게시글 상세 조회
export async function getPost(postId: number): Promise<PostResponse> {
  const response = await apiClient.get<ApiResponse<PostResponse>>(
    `/api/v1/posts/${postId}`,
  );
  return response.data;
}

// 게시글 삭제
export async function deletePost(postId: number): Promise<void> {
  await apiClient.delete(`/api/v1/posts/${postId}`);
}

// 게시글 Config 조회 (유형, 원인, 감정 목록)
export async function getPostConfig(): Promise<PostConfig> {
  const response = await apiClient.get<ApiResponse<PostConfig>>(
    "/api/v1/posts/configs",
  );
  return response.data;
}

// 게시글 생성
export async function createPost(
  data: PostCreateRequest,
): Promise<PostResponse> {
  const response = await apiClient.post<ApiResponse<PostResponse>>(
    "/api/v1/posts",
    data,
  );
  return response.data;
}
