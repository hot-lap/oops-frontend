# 인증 시스템 (Authentication)

이 문서는 OOPS 프로젝트의 인증 시스템 아키텍처와 사용법을 설명합니다.

---

## 개요

OOPS는 두 가지 유저 타입을 지원합니다:

| 유저 타입 | 설명                                  | 토큰                           |
| --------- | ------------------------------------- | ------------------------------ |
| **Guest** | 비로그인 사용자, 서비스 체험 가능     | `accessToken`만 사용           |
| **User**  | OAuth 로그인 사용자, 데이터 영구 보관 | `accessToken` + `refreshToken` |

---

## 인증 흐름

```
┌─────────────────────────────────────────────────────────────┐
│  1. 최초 접속 (토큰 없음)                                     │
│     └─> AuthProvider 초기화                                  │
│         └─> 토큰 없음 → Guest 토큰 자동 발급                  │
│             └─> 쿠키에 저장 → API 호출 가능                   │
├─────────────────────────────────────────────────────────────┤
│  2. 재접속 (토큰 있음)                                        │
│     └─> AuthProvider 초기화                                  │
│         └─> 기존 토큰으로 /api/v1/my-info 호출               │
│             ├─> 유효함 → 상태 복원 (userId, userType)        │
│             └─> 유효하지 않음 → 토큰 삭제 → Guest 토큰 재발급 │
├─────────────────────────────────────────────────────────────┤
│  3. OAuth 로그인 (추후 구현)                                  │
│     └─> OAuth Provider 인증                                  │
│         └─> 서버에서 User 토큰 발급                           │
│             └─> loginAsUser() 호출                           │
│                 └─> Guest 토큰 삭제 → User 토큰 저장          │
├─────────────────────────────────────────────────────────────┤
│  4. 로그아웃                                                 │
│     └─> logout() 호출                                        │
│         └─> 서버에 로그아웃 요청                              │
│             └─> User 토큰 삭제 → Guest 토큰 재발급            │
├─────────────────────────────────────────────────────────────┤
│  5. 토큰 만료 시 (User만)                                    │
│     └─> refreshTokens() 호출                                 │
│         └─> 새 토큰 발급 → 저장                               │
│         └─> 실패 시 → 로그아웃 처리                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 파일 구조

```
src/
├── lib/
│   ├── auth/
│   │   └── token.ts          # 토큰 저장/조회/삭제 유틸리티
│   └── api/
│       └── auth.ts           # 인증 API 함수
├── stores/
│   └── useAuthStore.ts       # 인증 상태 관리 (Zustand)
└── components/
    └── common/
        └── AuthProvider.tsx  # 앱 초기화 시 토큰 체크
```

---

## 쿠키 키

| 키                   | 용도                    | 유효기간 |
| -------------------- | ----------------------- | -------- |
| `oops_access_token`  | Access 토큰             | 7일      |
| `oops_refresh_token` | Refresh 토큰 (User만)   | 30일     |
| `oops_user_type`     | `"guest"` 또는 `"user"` | 7일      |

---

## API 엔드포인트

| 메서드 | 경로                               | 설명                                 |
| ------ | ---------------------------------- | ------------------------------------ |
| GET    | `/api/v1/my-info`                  | 토큰 유효성 검증 및 사용자 정보 조회 |
| POST   | `/api/v1/auth/guest-users/sign-up` | Guest 토큰 발급                      |
| POST   | `/api/v1/auth/token/refresh`       | 토큰 갱신                            |
| POST   | `/api/v1/auth/logout`              | 로그아웃                             |

---

## 사용법

### 1. 인증 상태 확인

```tsx
import { useAuthStore } from "@/stores/useAuthStore";
import { isGuest, isLoggedIn } from "@/lib/auth/token";

function MyComponent() {
  const { userType, userId } = useAuthStore();

  // Zustand store 사용
  if (userType === "guest") {
    return <GuestView />;
  }

  // 또는 유틸리티 함수 사용
  if (isGuest()) {
    return <GuestView />;
  }

  if (isLoggedIn()) {
    return <UserView userId={userId} />;
  }
}
```

### 2. OAuth 로그인 처리 (추후 구현)

```tsx
import { useAuthStore } from "@/stores/useAuthStore";

function OAuthCallback() {
  const { loginAsUser } = useAuthStore();

  useEffect(() => {
    // OAuth 콜백에서 토큰 받은 후
    const { accessToken, refreshToken, userId } = oauthResponse;

    // User로 로그인 (Guest 토큰 자동 삭제)
    loginAsUser(accessToken, refreshToken, userId);
  }, []);
}
```

### 3. 로그아웃

```tsx
import { useAuthStore } from "@/stores/useAuthStore";

function LogoutButton() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    // Guest 토큰이 자동으로 재발급됨
  };

  return <button onClick={handleLogout}>로그아웃</button>;
}
```

### 4. 토큰 갱신

```tsx
import { useAuthStore } from "@/stores/useAuthStore";

// 일반적으로 API 클라이언트에서 401 에러 시 자동 처리
// 수동으로 호출이 필요한 경우:
const { refreshTokens } = useAuthStore();
const success = await refreshTokens();
if (!success) {
  // 갱신 실패 - 자동으로 로그아웃 처리됨
}
```

---

## useAuthStore API

### State

| 속성            | 타입                        | 설명             |
| --------------- | --------------------------- | ---------------- |
| `isInitialized` | `boolean`                   | 초기화 완료 여부 |
| `isLoading`     | `boolean`                   | 로딩 중 여부     |
| `userType`      | `"guest" \| "user" \| null` | 현재 유저 타입   |
| `userId`        | `number \| null`            | 유저 ID          |
| `error`         | `string \| null`            | 에러 메시지      |

### Actions

| 메서드                                           | 설명                                   |
| ------------------------------------------------ | -------------------------------------- |
| `initialize()`                                   | 앱 초기화 (AuthProvider에서 자동 호출) |
| `loginAsGuest()`                                 | Guest 토큰 발급                        |
| `loginAsUser(accessToken, refreshToken, userId)` | User로 로그인                          |
| `logout()`                                       | 로그아웃 후 Guest 토큰 재발급          |
| `refreshTokens()`                                | 토큰 갱신 (User만)                     |

---

## Token 유틸리티 API

```tsx
import {
  getAccessToken,
  getRefreshToken,
  getUserType,
  isGuest,
  isLoggedIn,
  hasToken,
  saveGuestToken,
  saveUserTokens,
  clearTokens,
  updateAccessToken,
} from "@/lib/auth/token";
```

| 함수                              | 반환 타입                   | 설명                   |
| --------------------------------- | --------------------------- | ---------------------- |
| `getAccessToken()`                | `string \| null`            | Access 토큰 조회       |
| `getRefreshToken()`               | `string \| null`            | Refresh 토큰 조회      |
| `getUserType()`                   | `"guest" \| "user" \| null` | 유저 타입 조회         |
| `isGuest()`                       | `boolean`                   | Guest 여부             |
| `isLoggedIn()`                    | `boolean`                   | User 로그인 여부       |
| `hasToken()`                      | `boolean`                   | 토큰 존재 여부         |
| `saveGuestToken(token)`           | `void`                      | Guest 토큰 저장        |
| `saveUserTokens(access, refresh)` | `void`                      | User 토큰 저장         |
| `clearTokens()`                   | `void`                      | 모든 토큰 삭제         |
| `updateAccessToken(token)`        | `void`                      | Access 토큰만 업데이트 |

---

## Auth API 함수

```tsx
import {
  createGuestUser,
  refreshTokens,
  logout,
  getMyInfo,
} from "@/lib/api/auth";
```

| 함수                                       | 반환 타입                                | 설명                                    |
| ------------------------------------------ | ---------------------------------------- | --------------------------------------- |
| `getMyInfo(accessToken)`                   | `Promise<{ userId, type } \| null>`      | 토큰 유효성 검증 (유효하지 않으면 null) |
| `createGuestUser()`                        | `Promise<{ accessToken, userId }>`       | Guest 토큰 발급                         |
| `refreshTokens(accessToken, refreshToken)` | `Promise<{ accessToken, refreshToken }>` | 토큰 갱신                               |
| `logout(accessToken)`                      | `Promise<void>`                          | 로그아웃                                |

---

## 주의사항

1. **AuthProvider 필수**: 앱 최상위에 `AuthProvider`가 있어야 자동 토큰 발급이 동작합니다.

2. **토큰 유효성 검증**: 앱 초기화 시 `/api/v1/my-info`를 호출하여 기존 토큰의 유효성을 검증합니다. 유효하지 않으면 자동으로 새 Guest 토큰을 발급합니다.

3. **SSR 환경**: 토큰 관련 함수는 클라이언트에서만 동작합니다. 서버에서는 `null`을 반환합니다.

4. **API 호출**: `apiClient`가 자동으로 `X-OOPS-AUTH-TOKEN` 헤더에 토큰을 포함합니다.

5. **토큰 전환**: `loginAsUser()` 호출 시 기존 Guest 토큰이 자동 삭제됩니다.
