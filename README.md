# OOPS Frontend

실수를 기록하는 개인 기록 공간 **Oops!** 의 프론트엔드입니다.

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
| Session      | iron-session         | -    |
| HTTP Client  | ky                   | -    |

## 시작하기

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에서 값 수정

# 개발 서버 실행
pnpm dev
```

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router (라우팅)
│   ├── api/                  # BFF API 라우트 (세션, 프록시)
│   ├── auth/                 # OAuth 콜백
│   ├── history/              # 기록 조회/상세
│   ├── write/                # 기록 작성/수정
│   ├── not-found.tsx         # 404 페이지
│   ├── page.tsx              # 홈
│   └── providers.tsx         # 전역 Provider
│
├── components/               # 공유 컴포넌트
│   ├── common/               # 범용 UI (GNB, Header, Modal, AsyncBoundary)
│   ├── ui/                   # 기본 UI (Button, Calendar, Skeleton, Toast)
│   └── feature/              # 도메인별 기능 컴포넌트
│       ├── history/          #   기록 조회 관련
│       └── write/            #   기록 작성 관련
│
├── hooks/                    # 커스텀 훅
│   ├── queries/              # React Query 조회 훅
│   └── mutations/            # React Query 변경 훅
│
├── lib/                      # 유틸리티, 설정
│   ├── api/                  # API 함수 (auth, home, oauth, posts)
│   ├── oauth/                # OAuth 유틸리티
│   └── utils/                # 헬퍼 함수
│
├── types/                    # 타입 정의
├── stores/                   # 전역 상태 (Zustand)
└── assets/                   # 정적 자산 (SVG 아이콘)
```

## 컴포넌트 배치 기준

```
2개 이상 페이지에서 사용?
  ├── Yes → src/components/ (common / ui / feature)
  └── No  → 페이지 파일 내 로컬 컴포넌트
```

## 문서

자세한 아키텍처 및 컨벤션은 [docs/](./docs/) 폴더를 참고하세요:

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — 전체 아키텍처 및 프로젝트 구조
- [API.md](./docs/API.md) — API 엔드포인트 명세
- [AUTH.md](./docs/AUTH.md) — 인증 시스템 상세
- [BFF_ARCHITECTURE.md](./docs/BFF_ARCHITECTURE.md) — BFF 아키텍처 및 세션 관리
- [DATA_FETCHING_CONVENTION.md](./docs/DATA_FETCHING_CONVENTION.md) — 데이터 fetching 컨벤션
