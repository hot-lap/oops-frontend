import { apiClient } from "../client";

/**
 * 게시글 삭제
 */
export async function deletePost(postId: number): Promise<void> {
  await apiClient.delete(`api/v1/posts/${postId}`);
}
