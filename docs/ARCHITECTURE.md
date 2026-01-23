# OOPS Frontend Architecture

이 문서는 OOPS 프론트엔드 프로젝트의 전체 아키텍처를 설명합니다.
**새로운 기능을 구현하기 전에 반드시 이 문서와 관련 문서를 먼저 읽어주세요.**

---

## 기술 스택

| 카테고리     | 기술                 | 버전 |
| ------------ | -------------------- | ---- |
| Framework    | Next.js (App Router) | 16.x |
| Language     | TypeScript           | 5.x  |
| Styling      | Tailwind CSS         | 4.x  |
| Server State | TanStack Query       | 5.x  |
| Client State | Zustand              | 5.x  |
| Form         | React Hook Form      | 7.x  |
| Animation    | Framer Motion        | 12.x |

---

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router (라우팅)
│   ├── (auth)/               # Route Group - 인증 관련 페이지
│   │   ├── login/
│   │   └── signup/
│   ├── auth/                 # OAuth 콜백 페이지
│   │   └── google/
│   │       └── callback/
│   │           └── page.tsx  # Google OAuth 콜백 처리
│   ├── history/              # 기록 조회 페이지
│   │   ├── [id]/             # 기록 상세 (동적 라우트)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── write/                # 기록 작성/수정 페이지
│   │   ├── [id]/             # 기록 수정 (동적 라우트)
│   │   │   └── page.tsx
│   │   ├── success/          # 저장 성공 페이지
│   │   │   └── page.tsx
│   │   └── page.tsx          # 기록 작성
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 홈 페이지
│   ├── providers.tsx         # 전역 Provider 설정
│   └── globals.css
│
├── components/               # 공유 컴포넌트
│   ├── index.ts              # Barrel export (모든 컴포넌트)
│   ├── common/               # 범용 UI 컴포넌트
│   │   ├── index.ts          # Barrel export
│   │   ├── AsyncBoundary.tsx # Suspense + ErrorBoundary
│   │   ├── AuthProvider.tsx  # 인증 초기화
│   │   ├── ClientOnly.tsx
│   │   ├── Header.tsx
│   │   ├── LeaveConfirmModal.tsx  # 페이지 이탈 확인 모달
│   │   └── Modal.tsx
│   ├── ui/                   # 기본 UI 컴포넌트 (shadcn 스타일)
│   │   ├── index.ts          # Barrel export
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   └── skeleton.tsx      # 로딩 스켈레톤
│   └── feature/              # 도메인별 기능 컴포넌트
│       ├── index.ts          # Barrel export
│       ├── RecentPosts.tsx   # 홈 - 최근 기록
│       ├── history/          # 기록 조회 관련
│       │   ├── index.ts
│       │   ├── DeleteConfirmModal.tsx
│       │   ├── PastRecordItem.tsx
│       │   ├── RecordCard.tsx
│       │   ├── RecordDetail.tsx
│       │   ├── SummaryCard.tsx
│       │   └── Tag.tsx
│       └── write/            # 기록 작성 관련
│           ├── index.ts
│           ├── ConfigSelector.tsx
│           ├── ConfigSelectorSkeleton.tsx
│           └── WriteForm.tsx
│
├── hooks/                    # 커스텀 훅
│   ├── queries/              # React Query 훅 (조회 + 생성)
│   │   ├── usePosts.ts       # 게시글 조회/생성 훅
│   │   └── useHome.ts        # 홈 데이터 훅
│   ├── mutations/            # React Query 훅 (수정 + 삭제)
│   │   ├── useUpdatePost.ts  # 게시글 수정 훅
│   │   └── useDeletePost.ts  # 게시글 삭제 훅
│   └── useLoadingTitle.ts    # 로딩 타이틀 훅
│
├── lib/                      # 유틸리티, 설정
│   ├── api/                  # API 관련
│   │   ├── client.ts         # API 클라이언트
│   │   ├── auth.ts           # 인증 API
│   │   ├── home.ts           # 홈 API
│   │   ├── oauth.ts          # OAuth API (회원가입/로그인)
│   │   └── posts.ts          # 게시글 API
│   ├── auth/                 # 인증 유틸리티
│   │   └── token.ts          # 토큰 관리
│   ├── oauth/                # OAuth 유틸리티
│   │   └── google.ts         # Google OAuth URL 생성
│   ├── utils/                # 헬퍼 함수
│   │   └── postFormatter.ts  # API → UI 데이터 변환
│   └── queryClient.ts        # React Query 설정
│
├── types/                    # 타입 정의
│   ├── api/                  # API 응답 타입
│   │   ├── posts.ts
│   │   ├── home.ts
│   │   └── oauth.ts          # OAuth 응답 타입
│   └── index.ts              # 공통 타입 (Modal 등)
│
├── stores/                   # 전역 상태 (Zustand)
│   ├── useAuthStore.ts       # 인증 상태
│   └── useModalStore.ts      # 모달 상태
│
├── constants/                # 상수
│   └── constants.ts
│
└── assets/                   # 정적 자산
    └── icons/                # SVG 아이콘
```

---

## 핵심 아키텍처 패턴

### 1. Provider 구조

```tsx
// app/layout.tsx
<html>
  <body>
    <Providers>        {/* providers.tsx */}
      {children}
    </Providers>
  </body>
</html>

// app/providers.tsx
<QueryClientProvider>  {/* React Query */}
  <AuthProvider>       {/* 인증 초기화 */}
    {children}
  </AuthProvider>
  <ModalRenderer />    {/* 전역 모달 */}
</QueryClientProvider>
```

### 2. 데이터 Fetching 패턴

**선언적 Suspense 패턴**을 사용합니다. 자세한 내용은 [DATA_FETCHING_CONVENTION.md](./DATA_FETCHING_CONVENTION.md)를 참고하세요.

```tsx
// Page Component
export default function Page() {
  return (
    <AsyncBoundary
      pendingFallback={<Skeleton />}
      rejectedFallback={({ reset }) => <Error onRetry={reset} />}
    >
      <Content />
    </AsyncBoundary>
  );
}

// Content Component
function Content() {
  const { data } = useSuspenseQuery(...);  // data는 항상 존재
  return <UI data={data} />;
}
```

### 3. 인증 패턴

자세한 내용은 [AUTH.md](./AUTH.md)를 참고하세요.

```tsx
// 앱 시작 시 AuthProvider가 자동으로:
// 1. 기존 토큰 확인
// 2. 없으면 Guest 토큰 발급
// 3. API 호출 시 자동으로 토큰 포함
```

### 4. 상태 관리 전략

| 상태 유형           | 도구            | 예시                 |
| ------------------- | --------------- | -------------------- |
| Server State        | TanStack Query  | API 데이터, 캐싱     |
| Client State (전역) | Zustand         | 인증, 모달           |
| Client State (로컬) | useState        | UI 상태              |
| Form State          | React Hook Form | 폼 입력, 유효성 검사 |

---

## 관련 문서

| 문서                                                         | 설명                   |
| ------------------------------------------------------------ | ---------------------- |
| [API.md](./API.md)                                           | API 엔드포인트 명세    |
| [AUTH.md](./AUTH.md)                                         | 인증 시스템 상세       |
| [DATA_FETCHING_CONVENTION.md](./DATA_FETCHING_CONVENTION.md) | 데이터 fetching 컨벤션 |

---

## 컴포넌트 배치 기준

```
src/components/
├── common/   범용 UI (Header, Modal, AsyncBoundary 등)
├── ui/       기본 UI (Button, Calendar, Skeleton 등)
└── feature/  도메인별 기능 컴포넌트
    ├── history/   기록 조회 관련
    ├── write/     기록 작성 관련
    └── *.tsx      공통 feature (RecentPosts 등)
```

**모든 feature 컴포넌트는 `src/components/feature/`에 도메인별로 배치합니다.**
페이지 전용 컴포넌트도 `feature/[domain]/`에 위치시켜 일관된 import 경로를 유지합니다.

---

## 파일 네이밍 규칙

| 유형     | 규칙                                 | 예시                           |
| -------- | ------------------------------------ | ------------------------------ |
| 컴포넌트 | PascalCase                           | `AsyncBoundary.tsx`            |
| 훅       | camelCase, use 접두사                | `usePosts.ts`                  |
| 유틸리티 | camelCase                            | `postFormatter.ts`             |
| 타입     | camelCase                            | `posts.ts`                     |
| 상수     | camelCase (파일), UPPER_SNAKE (변수) | `constants.ts`, `API_BASE_URL` |

---

## Import 규칙

### Barrel Export 패턴

컴포넌트는 `@/components`에서 통합 import합니다:

```tsx
// ✅ 권장: Barrel export 사용
import { Header, AsyncBoundary, Button, Calendar } from "@/components";

// ⚠️ 가능하지만 비권장: 개별 파일에서 import
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
```

### Import 순서

```tsx
// 1. React/Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. 외부 라이브러리
import { useQuery } from "@tanstack/react-query";

// 3. 내부 절대 경로 (@/)
import { Button, Header } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { getPost } from "@/lib/api/posts";
import type { Post } from "@/types/api/posts";

// 4. 상대 경로
import { LocalComponent } from "./components";
```

---

## 환경 변수

| 변수                  | 설명         | 기본값                 |
| --------------------- | ------------ | ---------------------- |
| `NEXT_PUBLIC_API_URL` | API 서버 URL | `http://api.oops.rest` |

`.env.local` 예시:

```
NEXT_PUBLIC_API_URL=http://api.oops.rest
```

---

## 주요 의존성

```json
{
  "@tanstack/react-query": "서버 상태 관리",
  "zustand": "클라이언트 전역 상태",
  "react-hook-form": "폼 관리",
  "date-fns": "날짜 포맷팅",
  "framer-motion": "애니메이션",
  "clsx": "조건부 클래스",
  "tailwind-merge": "Tailwind 클래스 병합"
}
```

---

## 개발 가이드

### 새 페이지 추가

1. `app/[page-name]/page.tsx` 생성
2. 페이지 관련 컴포넌트는 `src/components/feature/[page-name]/`에 배치
3. API 데이터가 필요하면 `AsyncBoundary` 패턴 적용

### 새 API 연동

1. `types/api/[domain].ts`에 타입 정의
2. `lib/api/[domain].ts`에 API 함수 작성
3. `hooks/queries/use[Domain].ts`에 `useSuspense*` 훅 작성
4. 컴포넌트에서 `AsyncBoundary` + `useSuspense*` 사용

### 전역 상태 추가

1. `stores/use[Name]Store.ts` 생성
2. Zustand `create()` 사용
3. 필요시 `providers.tsx`에 Provider 추가
