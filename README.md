# OOPS Frontend

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router (라우팅)
│   ├── (auth)/               # Route Group - 인증 관련 페이지
│   │   ├── login/
│   │   └── signup/
│   ├── [page]/
│   │   ├── components/       # 해당 페이지 전용 컴포넌트
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.css
│
├── components/               # 공유 컴포넌트
│   ├── common/               # 범용 UI 컴포넌트 (Modal, Button, Input 등)
│   ├── layout/               # 레이아웃 컴포넌트 (Header, Footer, Sidebar 등)
│   └── feature/              # 특정 기능 컴포넌트 (비즈니스 로직 포함)
│
├── hooks/                    # 커스텀 훅
│   ├── common/               # 범용 훅 (useDebounce, useLocalStorage 등)
│   ├── queries/              # React Query 훅 (API 조회)
│   └── mutations/            # React Query mutation 훅 (API 변경)
│
├── lib/                      # 유틸리티, 설정
│   ├── api/                  # API 클라이언트, 인터셉터
│   ├── utils/                # 헬퍼 함수
│   └── queryClient.ts
│
├── types/                    # 타입 정의
│   ├── api/                  # API 응답 타입
│   └── common/               # 공통 타입
│
├── constants/                # 상수
│
└── stores/                   # 전역 상태 (Zustand 등)
```

## 폴더 구조 원칙

| 원칙                     | 설명                                             |
| ------------------------ | ------------------------------------------------ |
| **페이지 전용 컴포넌트** | `app/[page]/components/`에 배치                  |
| **공유 컴포넌트**        | `components/`에 용도별로 분리                    |
| **Colocation**           | 관련된 것들은 가까이 배치                        |
| **기능별 분리**          | hooks, types 등은 기능/도메인별로 하위 폴더 구성 |

## 컴포넌트 배치 기준

```
2개 이상 페이지에서 사용?
  ├── Yes → src/components/
  └── No  → app/[page]/components/
```
