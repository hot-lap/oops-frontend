import {
  useQuery,
  useInfiniteQuery,
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getWeekPosts,
  getPosts,
  getPost,
  getPostConfig,
  createPost,
} from "@/lib/api";
import type { PostCreateRequest } from "@/types/api/posts";

export const postKeys = {
  all: ["posts"] as const,
  weeks: () => [...postKeys.all, "weeks"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (includeThisWeek: boolean) =>
    [...postKeys.lists(), { includeThisWeek }] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
  config: () => [...postKeys.all, "config"] as const,
};

// ============================================
// Suspense 버전 (권장)
// - Suspense/ErrorBoundary와 함께 사용
// - data가 항상 존재 (undefined 아님)
// ============================================

// 이번주 게시글 및 요약 통계 조회 (Suspense)
export function useSuspenseWeekPosts() {
  return useSuspenseQuery({
    queryKey: postKeys.weeks(),
    queryFn: getWeekPosts,
  });
}

// 게시글 페이징 조회 - 무한 스크롤 (Suspense)
export function useSuspenseInfinitePosts(
  includeThisWeek: boolean = false,
  size: number = 10,
) {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.list(includeThisWeek),
    queryFn: ({ pageParam }) => getPosts(pageParam, size, includeThisWeek),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPage - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}

// 게시글 상세 조회 (Suspense)
export function useSuspensePost(postId: number) {
  return useSuspenseQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPost(postId),
  });
}

// 게시글 Config 조회 (Suspense) - 유형, 원인, 감정 목록
export function useSuspensePostConfig() {
  return useSuspenseQuery({
    queryKey: postKeys.config(),
    queryFn: getPostConfig,
    staleTime: 1000 * 60 * 60, // 1시간 - config는 자주 변하지 않음
  });
}

// ============================================
// 일반 버전 (필요시 사용)
// - Suspense 없이 사용해야 하는 특수 케이스
// - isLoading, isError 등 상태 직접 처리 필요
// ============================================

// 이번주 게시글 및 요약 통계 조회
export function useWeekPosts() {
  return useQuery({
    queryKey: postKeys.weeks(),
    queryFn: getWeekPosts,
  });
}

// 게시글 페이징 조회 (무한 스크롤용)
export function useInfinitePosts(
  includeThisWeek: boolean = false,
  size: number = 10,
) {
  return useInfiniteQuery({
    queryKey: postKeys.list(includeThisWeek),
    queryFn: ({ pageParam }) => getPosts(pageParam, size, includeThisWeek),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPage - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}

// 게시글 상세 조회
export function usePost(postId: number) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPost(postId),
    enabled: postId > 0,
  });
}

// ============================================
// Mutation
// ============================================

// 게시글 생성
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostCreateRequest) => createPost(data),
    onSuccess: () => {
      // 게시글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.weeks() });
    },
  });
}
