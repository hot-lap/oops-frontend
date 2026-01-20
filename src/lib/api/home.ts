import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api/posts";
import type { HomeDetailResponse } from "@/types/api/home";

// 홈 조회
export async function getHome(): Promise<HomeDetailResponse> {
  const response =
    await apiClient.get<ApiResponse<HomeDetailResponse>>("/api/v1/home");
  return response.data;
}
