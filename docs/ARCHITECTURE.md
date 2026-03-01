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
│   ├── api/                  # BFF API 라우트
│   │   ├── auth/             # 인증 관련 BFF 엔드포인트
│   │   │   ├── delete-account/
│   │   │   ├── guest/
│   │   │   ├── logout/
│   │   │   ├── me/
│   │   │   └── oauth/[provider]/
│   │   └── proxy/[...path]/  # API 프록시 (세션 토큰 자동 첨부)
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
│   ├── not-found.tsx         # 404 페이지
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
│   │   ├── GNB.tsx           # 글로벌 네비게이션 바 (홈, 404)
│   │   ├── Header.tsx        # 서브 페이지 헤더 (뒤로가기 + 제목)
│   │   ├── LeaveConfirmModal.tsx  # 페이지 이탈 확인 모달
│   │   └── Modal.tsx
│   ├── ui/                   # 기본 UI 컴포넌트 (shadcn 스타일)
│   │   ├── index.ts          # Barrel export
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── skeleton.tsx      # 로딩 스켈레톤
│   │   └── toast.tsx         # 커스텀 토스트 (react-hot-toast 기반)
│   └── feature/              # 도메인별 기능 컴포넌트
│       ├── index.ts          # Barrel export
│       ├── RecentPosts.tsx   # 홈 - 최근 기록
│       ├── history/          # 기록 조회 관련
│       │   ├── index.ts
│       │   ├── DeleteConfirmModal.tsx
│       │   ├── PastRecordItem.tsx
│       │   ├── RecordCard.tsx
│       │   ├── RecordContent.tsx  # 기록 상세 콘텐츠
│       │   ├── SummaryCard.tsx
│       │   └── Tag.tsx
│       └── write/            # 기록 작성 관련
│           ├── index.ts
│           ├── CalendarModal.tsx
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
│   ├── useHomeTitle.ts       # 홈 타이틀 훅
│   └── useLoadingTitle.ts    # 로딩 타이틀 훅
│
├── lib/                      # 유틸리티, 설정
│   ├── api/                  # API 관련 (도메인별 하위 폴더)
│   │   ├── index.ts          # Barrel export
│   │   ├── client.ts         # ky 기반 API 클라이언트
│   │   ├── server.ts         # 서버 전용 API 클라이언트
│   │   ├── auth/             # 인증 API
│   │   ├── home/             # 홈 API
│   │   ├── oauth/            # OAuth API (회원가입/로그인)
│   │   └── posts/            # 게시글 API (CRUD)
│   ├── oauth/                # OAuth 유틸리티
│   │   └── google.ts         # Google OAuth URL 생성
│   ├── utils/                # 헬퍼 함수
│   │   └── postFormatter.ts  # API → UI 데이터 변환
│   ├── utils.ts              # 범용 유틸리티 (cn 등)
│   ├── session.ts            # iron-session 설정
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
  <Toaster />          {/* 커스텀 토스트 알림 */}
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

### 3. 인증 패턴 (BFF)

자세한 내용은 [AUTH.md](./AUTH.md) 및 [BFF_ARCHITECTURE.md](./BFF_ARCHITECTURE.md)를 참고하세요.

```tsx
// BFF 아키텍처:
// 1. 토큰은 서버 세션(iron-session 암호화 쿠키)에 저장
// 2. 클라이언트는 /api/proxy/... 를 통해 API 호출
// 3. BFF가 세션에서 토큰을 꺼내 BE API에 자동 첨부
// 4. 클라이언트에 토큰이 노출되지 않음 (보안 강화)
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

| 문서                                                         | 설명                      |
| ------------------------------------------------------------ | ------------------------- |
| [API.md](./API.md)                                           | API 엔드포인트 명세       |
| [AUTH.md](./AUTH.md)                                         | 인증 시스템 상세          |
| [BFF_ARCHITECTURE.md](./BFF_ARCHITECTURE.md)                 | BFF 아키텍처 및 세션 관리 |
| [DATA_FETCHING_CONVENTION.md](./DATA_FETCHING_CONVENTION.md) | 데이터 fetching 컨벤션    |

---

## 컴포넌트 배치 기준

```
src/components/
├── common/   범용 UI (GNB, Header, Modal, AsyncBoundary 등)
├── ui/       기본 UI (Button, Calendar, Skeleton, Toast 등)
└── feature/  도메인별 기능 컴포넌트
    ├── history/   기록 조회 관련
    ├── write/     기록 작성 관련
    └── *.tsx      공통 feature (RecentPosts 등)
```

**GNB vs Header 사용 기준:**

| 컴포넌트 | 용도                        | 사용 페이지        |
| -------- | --------------------------- | ------------------ |
| `GNB`    | Oops! 로고 + 로그인 버튼    | 홈(`/`), 404       |
| `Header` | 뒤로가기 + 제목 + 우측 액션 | history, detail 등 |

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

| 변수                              | 공개 여부  | 설명                               | 예시                                         |
| --------------------------------- | ---------- | ---------------------------------- | -------------------------------------------- |
| `SESSION_SECRET`                  | 서버 전용  | iron-session 암호화 키 (32자 이상) | `openssl rand -base64 32` 으로 생성          |
| `API_URL`                         | 서버 전용  | BE API 서버 URL (BFF 프록시용)     | `https://api.oops.rest`                      |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`    | 클라이언트 | Google OAuth Client ID             | `xxxxx.apps.googleusercontent.com`           |
| `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` | 클라이언트 | Google OAuth Redirect URI          | `http://localhost:3000/auth/google/callback` |

### 로컬 개발 환경 (`.env.local`)

```
SESSION_SECRET=your-session-secret-at-least-32-characters-long
API_URL=https://api.oops.rest
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Vercel 배포 환경

Vercel Dashboard > Project Settings > Environment Variables에서 설정:

```
SESSION_SECRET=<secure-random-value>
API_URL=https://api.oops.rest
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://oops-frontend.vercel.app/auth/google/callback
```

**중요:**

- `SESSION_SECRET`은 프로덕션에서 반드시 안전한 랜덤 값을 사용해야 합니다.
- Google Cloud Console에서도 해당 Redirect URI를 등록해야 합니다.

---

## 주요 의존성

```json
{
  "@tanstack/react-query": "서버 상태 관리",
  "zustand": "클라이언트 전역 상태",
  "react-hook-form": "폼 관리",
  "iron-session": "BFF 세션 관리 (암호화 쿠키)",
  "ky": "HTTP 클라이언트",
  "date-fns": "날짜 포맷팅",
  "framer-motion": "애니메이션",
  "react-hot-toast": "토스트 알림 (커스텀 UI 래핑)",
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
