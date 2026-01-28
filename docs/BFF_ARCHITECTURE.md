# BFF (Backend for Frontend) 아키텍처

이 문서는 토큰 보안을 강화하기 위한 BFF 아키텍처 패턴을 설명합니다.

---

## 개요

BFF는 클라이언트와 실제 API 서버 사이에 위치하는 중간 서버로,
토큰 관리를 서버 측에서 처리하여 클라이언트에 토큰이 노출되지 않도록 합니다.

---

## 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│  브라우저 (클라이언트)                                            │
│  - 토큰 없음, 세션 쿠키만 보유                                     │
│  - API 호출: /api/* (BFF로)                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ httpOnly 세션 쿠키
┌─────────────────────────────────────────────────────────────────┐
│  BFF 서버 (Next.js API Routes)                                   │
│  - 세션 쿠키 ↔ 토큰 매핑 관리                                      │
│  - accessToken, refreshToken 보관                                │
│  - 실제 API 호출 시 토큰 첨부                                      │
│  - 토큰 만료 시 자동 갱신                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Bearer Token (또는 X-OOPS-AUTH-TOKEN)
┌─────────────────────────────────────────────────────────────────┐
│  실제 API 서버 (api.oops.rest)                                    │
│  - 토큰 검증                                                      │
│  - 비즈니스 로직                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 현재 방식 vs BFF 방식 비교

| 항목            | 현재 방식                      | BFF 방식                |
| --------------- | ------------------------------ | ----------------------- |
| 토큰 저장 위치  | 브라우저 쿠키                  | BFF 서버 (세션)         |
| 클라이언트 노출 | accessToken, refreshToken 노출 | 세션 ID만 노출          |
| XSS 공격 시     | 토큰 탈취 가능                 | 토큰 탈취 불가          |
| 토큰 갱신       | 클라이언트에서 처리            | BFF에서 자동 처리       |
| 인프라 복잡도   | 낮음                           | 높음 (세션 저장소 필요) |

---

## 세션 저장소 옵션

### 1. 메모리 (Map)

```typescript
const sessions = new Map<string, SessionData>();
```

- **장점**: 간단, 빠름
- **단점**: 서버 재시작 시 소멸, 스케일 아웃 불가
- **적합**: 개발 환경, 소규모

### 2. Redis

```typescript
await redis.set(`session:${sessionId}`, JSON.stringify(data), "EX", ttl);
```

- **장점**: 빠름, TTL 지원, 스케일 아웃 가능
- **단점**: 인프라 추가 필요
- **적합**: 프로덕션, 대규모

### 3. 데이터베이스

```sql
INSERT INTO sessions (id, data, expires_at) VALUES (?, ?, ?);
```

- **장점**: 영구 저장, 기존 인프라 활용
- **단점**: 상대적으로 느림
- **적합**: 이미 DB 있는 경우

### 4. 암호화된 쿠키 (Serverless 권장) ⭐

```typescript
// iron-session 사용
const session = await getIronSession(cookies(), options);
session.accessToken = "xxx";
await session.save(); // 암호화되어 쿠키에 저장
```

- **장점**: 서버 저장소 불필요, Serverless 친화적
- **단점**: 용량 제한 (4KB)
- **적합**: Vercel, 소규모

---

## 플로우

### 로그인

```
1. 클라이언트 → BFF: POST /api/auth/login { email, password }

2. BFF → API 서버: POST /api/v1/auth/login { email, password }

3. API 서버 → BFF: { accessToken, refreshToken, userId }

4. BFF:
   - 세션에 토큰 저장 (Redis, 암호화 쿠키 등)
   - httpOnly 쿠키로 세션 ID 설정

5. BFF → 클라이언트:
   Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict
   Body: { userId } (토큰 없음)
```

### API 호출

```
1. 클라이언트 → BFF: GET /api/posts
   Cookie: sessionId=abc123

2. BFF:
   - 세션에서 accessToken 조회
   - API 서버에 요청 (토큰 첨부)

3. BFF → API 서버: GET /api/v1/posts
   X-OOPS-AUTH-TOKEN: {accessToken}

4. API 서버 → BFF: { posts: [...] }

5. BFF → 클라이언트: { posts: [...] }
```

### 토큰 갱신 (자동)

```
1. BFF → API 서버: GET /api/v1/posts (accessToken 첨부)

2. API 서버 → BFF: 401 Unauthorized

3. BFF (자동 처리):
   - 세션에서 refreshToken 조회
   - 토큰 갱신 API 호출
   - 새 토큰으로 세션 업데이트
   - 원래 요청 재시도

4. BFF → 클라이언트: { posts: [...] }
   (클라이언트는 갱신 과정 모름)
```

---

## Next.js + iron-session 구현 예시

### 설치

```bash
pnpm add iron-session
```

### 세션 설정

```typescript
// lib/session.ts
import { SessionOptions } from "iron-session";

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!, // 최소 32자
  cookieName: "oops_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 90, // 90일
  },
};
```

### 로그인 API

```typescript
// app/api/auth/login/route.ts
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // 1. 실제 API 서버에 로그인 요청
  const response = await fetch(`${process.env.API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return Response.json({ error: "로그인 실패" }, { status: 401 });
  }

  const { accessToken, refreshToken, userId } = await response.json();

  // 2. 세션에 토큰 저장 (암호화되어 쿠키에 저장됨)
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.accessToken = accessToken;
  session.refreshToken = refreshToken;
  session.userId = userId;
  await session.save();

  // 3. 클라이언트에는 토큰 없이 응답
  return Response.json({ userId });
}
```

### API 프록시

```typescript
// app/api/posts/route.ts
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.accessToken) {
    return Response.json({ error: "인증 필요" }, { status: 401 });
  }

  // API 서버에 요청
  let response = await fetch(`${process.env.API_URL}/api/v1/posts`, {
    headers: { "X-OOPS-AUTH-TOKEN": session.accessToken },
  });

  // 401이면 토큰 갱신 후 재시도
  if (response.status === 401 && session.refreshToken) {
    const refreshed = await refreshTokens(session);

    if (refreshed) {
      await session.save();
      response = await fetch(`${process.env.API_URL}/api/v1/posts`, {
        headers: { "X-OOPS-AUTH-TOKEN": session.accessToken },
      });
    }
  }

  const data = await response.json();
  return Response.json(data);
}

async function refreshTokens(session: SessionData): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/auth/token/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        }),
      },
    );

    if (!response.ok) return false;

    const data = await response.json();
    session.accessToken = data.data.accessToken;
    session.refreshToken = data.data.refreshToken;
    return true;
  } catch {
    return false;
  }
}
```

---

## BE API (현재 적용됨)

토큰 갱신 API가 다음과 같이 변경되었습니다:

```
POST /api/v1/auth/token/refresh
{
  "refreshToken": "required"
}
```

**장점:**

- refreshToken JWT 자체에 userId가 포함되어 있음
- accessToken 검증 없이도 userId 확인 가능
- 클라이언트/BFF에서 accessToken 만료 관리가 단순해짐

---

## 도입 시 고려사항

### 장점

- 토큰이 클라이언트에 노출되지 않음 (XSS 방어)
- 토큰 갱신 로직이 서버에서 처리됨
- httpOnly 쿠키로 보안 강화

### 단점

- 모든 API 요청이 BFF를 거침 (레이턴시 증가)
- 인프라 복잡도 증가
- 기존 클라이언트 코드 전면 수정 필요

### 적합한 상황

- 보안이 중요한 서비스
- Serverless 환경 (Vercel + iron-session)
- 새로 시작하는 프로젝트

### 부적합한 상황

- 레이턴시에 민감한 서비스
- 이미 클라이언트 토큰 관리가 안정적인 경우
- 빠른 MVP 개발이 필요한 경우

---

## 참고 자료

- [iron-session 공식 문서](https://github.com/vvo/iron-session)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [BFF 패턴 설명 (Microsoft)](https://docs.microsoft.com/en-us/azure/architecture/patterns/backends-for-frontends)
