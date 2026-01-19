# Data Fetching Convention

이 문서는 OOPS 프로젝트에서 데이터 fetching 시 따라야 할 컨벤션을 정의합니다.
**새로운 기능을 구현하기 전에 반드시 이 문서를 먼저 읽어주세요.**

---

## 핵심 원칙

1. **선언적 데이터 fetching**: `useSuspenseQuery` + `AsyncBoundary` 패턴 사용
2. **관심사 분리**: 로딩/에러 처리는 부모, 데이터 렌더링은 자식
3. **타입 안정성**: `data`가 항상 존재한다고 보장 (undefined 아님)

---

## 기술 스택

| 라이브러리              | 버전 | 용도                                                           |
| ----------------------- | ---- | -------------------------------------------------------------- |
| `@tanstack/react-query` | v5   | 서버 상태 관리, `useSuspenseQuery`, `useSuspenseInfiniteQuery` |

---

## 폴더 구조

```
src/
├── hooks/
│   ├── queries/           # 데이터 조회 hooks
│   │   └── usePosts.ts    # useSuspensePost, useSuspenseWeekPosts 등
│   └── mutations/         # 데이터 변경 hooks
│       └── useDeletePost.ts
├── lib/
│   └── api/
│       ├── client.ts      # API 클라이언트
│       └── posts.ts       # API 함수 (getPost, getPosts 등)
├── types/
│   └── api/
│       └── posts.ts       # API 응답 타입
└── components/
    └── common/
        └── AsyncBoundary.tsx  # Suspense + ErrorBoundary 래퍼
```

---

## 패턴 1: Suspense 기반 데이터 fetching (권장)

### 구조

```
┌─────────────────────────────────────┐
│  Page Component                     │
│  ┌───────────────────────────────┐  │
│  │  AsyncBoundary                │  │
│  │  - pendingFallback: Skeleton  │  │
│  │  - rejectedFallback: Error    │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Content Component      │  │  │
│  │  │  - useSuspenseQuery()   │  │  │
│  │  │  - 실제 UI 렌더링        │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 코드 예시

```tsx
// page.tsx
export default function PostDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <div className="min-h-screen">
      <Header />
      <AsyncBoundary
        pendingFallback={<PostDetailSkeleton />}
        rejectedFallback={({ reset }) => <PostDetailError onRetry={reset} />}
      >
        <PostDetailContent postId={id} />
      </AsyncBoundary>
    </div>
  );
}

// 실제 데이터를 fetch하고 렌더링하는 컴포넌트
function PostDetailContent({ postId }: { postId: number }) {
  // Suspense 버전 - data는 항상 존재
  const { data } = useSuspensePost(postId);

  // isLoading, isError 체크 불필요!
  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </article>
  );
}

// 로딩 스켈레톤
function PostDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="mt-4 h-32 w-full bg-gray-200 rounded" />
    </div>
  );
}

// 에러 UI
function PostDetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-gray-500">데이터를 불러오는데 실패했습니다.</p>
      <button onClick={onRetry}>다시 시도</button>
    </div>
  );
}
```

---

## 패턴 2: Query Hooks 작성 규칙

### 파일 위치

```
src/hooks/queries/use[Domain].ts
```

### 네이밍 규칙

| 유형                 | 네이밍                         | 예시                         |
| -------------------- | ------------------------------ | ---------------------------- |
| Suspense 단일 조회   | `useSuspense[Domain]`          | `useSuspensePost(id)`        |
| Suspense 목록 조회   | `useSuspense[Domain]s`         | `useSuspenseWeekPosts()`     |
| Suspense 무한 스크롤 | `useSuspenseInfinite[Domain]s` | `useSuspenseInfinitePosts()` |
| 일반 단일 조회       | `use[Domain]`                  | `usePost(id)`                |
| 일반 목록 조회       | `use[Domain]s`                 | `useWeekPosts()`             |

### Query Key 관리

```tsx
// 모든 key를 객체로 중앙 관리
export const postKeys = {
  all: ["posts"] as const,
  weeks: () => [...postKeys.all, "weeks"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filter: PostFilter) => [...postKeys.lists(), filter] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};
```

### Suspense Hook 작성

```tsx
// ✅ 올바른 import - @tanstack/react-query에서 직접 import
import {
  useSuspenseQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";

// 단일 조회
export function useSuspensePost(postId: number) {
  return useSuspenseQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPost(postId),
  });
}

// 무한 스크롤
export function useSuspenseInfinitePosts(filter: PostFilter) {
  return useSuspenseInfiniteQuery({
    queryKey: postKeys.list(filter),
    queryFn: ({ pageParam }) => getPosts(pageParam, filter),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPage - 1 ? lastPage.page + 1 : undefined,
  });
}
```

---

## 패턴 3: Mutation Hooks 작성 규칙

### 파일 위치

```
src/hooks/mutations/use[Action][Domain].ts
```

### 네이밍 규칙

| 액션 | 네이밍              | 예시              |
| ---- | ------------------- | ----------------- |
| 생성 | `useCreate[Domain]` | `useCreatePost()` |
| 수정 | `useUpdate[Domain]` | `useUpdatePost()` |
| 삭제 | `useDelete[Domain]` | `useDeletePost()` |

### Mutation Hook 작성

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/hooks/queries/usePosts";

interface UseDeletePostOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeletePost(options?: UseDeletePostOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}
```

---

## 패턴 4: AsyncBoundary 사용

### 기본 사용

```tsx
import { AsyncBoundary } from "@/components";

<AsyncBoundary>
  <DataComponent />
</AsyncBoundary>;
```

### 커스텀 Fallback 사용

```tsx
<AsyncBoundary
  pendingFallback={<CustomSkeleton />}
  rejectedFallback={({ reset, error }) => (
    <CustomError error={error} onRetry={reset} />
  )}
>
  <DataComponent />
</AsyncBoundary>
```

### 독립적인 영역 분리

여러 독립적인 데이터 영역이 있을 때, 각각 AsyncBoundary로 감싸면 부분 로딩/에러 처리 가능:

```tsx
<div className="flex gap-4">
  <AsyncBoundary pendingFallback={<SidebarSkeleton />}>
    <Sidebar />
  </AsyncBoundary>

  <AsyncBoundary pendingFallback={<MainContentSkeleton />}>
    <MainContent />
  </AsyncBoundary>
</div>
```

---

## 패턴 5: API 함수 작성 규칙

### 파일 위치

```
src/lib/api/[domain].ts
```

### API 함수 작성

```tsx
// src/lib/api/posts.ts
import { apiClient } from "./client";
import type { ApiResponse, PostResponse } from "@/types/api/posts";

// 단일 조회
export async function getPost(postId: number): Promise<PostResponse> {
  const response = await apiClient.get<ApiResponse<PostResponse>>(
    `/api/v1/posts/${postId}`,
  );
  return response.data;
}

// 목록 조회
export async function getPosts(
  page: number,
  filter: PostFilter,
): Promise<PagePostResponse> {
  return apiClient.get<PagePostResponse>("/api/v1/posts/posts", {
    page,
    ...filter,
  });
}

// 삭제
export async function deletePost(postId: number): Promise<void> {
  await apiClient.delete(`/api/v1/posts/${postId}`);
}
```

---

## 패턴 6: 타입 정의

### 파일 위치

```
src/types/api/[domain].ts
```

### 타입 구조

```tsx
// API 공통 응답 래퍼
export interface ApiResponse<T> {
  data: T;
}

// 도메인 타입
export interface Post {
  id: number;
  content: string;
  category: string;
  // ...
}

// 상세 응답 (추가 필드 포함)
export interface PostResponse extends Post {
  createdAt: string;
  modifiedAt: string;
}

// 페이징 응답
export interface PagePostResponse {
  content: PostResponse[];
  page: number;
  size: number;
  totalPage: number;
  totalCount: number;
}
```

---

## 체크리스트

새로운 데이터 fetching 기능 구현 시:

- [ ] `src/types/api/[domain].ts`에 API 응답 타입 정의
- [ ] `src/lib/api/[domain].ts`에 API 함수 작성
- [ ] `src/hooks/queries/use[Domain].ts`에 `useSuspense*` hook 작성
- [ ] Query key를 `[domain]Keys` 객체로 관리
- [ ] 페이지에서 `AsyncBoundary`로 Content 컴포넌트 감싸기
- [ ] Skeleton, Error 컴포넌트 작성
- [ ] Content 컴포넌트에서 `useSuspense*` hook 사용
- [ ] `if (isLoading)`, `if (isError)` 패턴 사용하지 않음

---

## 하지 말아야 할 것 (Anti-patterns)

### 1. 명령형 로딩/에러 처리

```tsx
// ❌ Bad
function PostList() {
  const { data, isLoading, isError } = useQuery(...);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return <List data={data} />;
}

// ✅ Good
function PostList() {
  const { data } = useSuspenseQuery(...);
  return <List data={data} />;
}
```

### 2. 컴포넌트 내부에서 직접 fetch

```tsx
// ❌ Bad
function PostList() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return <List data={data} />;
}

// ✅ Good - React Query 사용
function PostList() {
  const { data } = useSuspensePosts();
  return <List data={data} />;
}
```

### 3. Query key 하드코딩

```tsx
// ❌ Bad
useQuery({ queryKey: ["posts", "detail", id], ... });
useQuery({ queryKey: ["posts", "detail", id], ... }); // 오타 위험

// ✅ Good - 중앙 관리
useQuery({ queryKey: postKeys.detail(id), ... });
```

---

## 참고 자료

- [TanStack Query v5 Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Suspensive Docs](https://suspensive.org/ko/docs/react/Suspense)
- [React Suspense for Data Fetching](https://react.dev/reference/react/Suspense)
