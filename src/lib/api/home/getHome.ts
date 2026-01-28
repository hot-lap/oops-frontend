import { apiClient, type ApiResponse } from "../client";
import type { HomeDetailResponse } from "@/types/api/home";

/**
 * 홈 조회
 */
export async function getHome(): Promise<HomeDetailResponse> {
  const response = await apiClient
    .get("api/v1/home")
    .json<ApiResponse<HomeDetailResponse>>();

  return response.data;
}
