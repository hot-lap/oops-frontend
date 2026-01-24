# OOPS API 문서

## 기본 정보

- **Base URL**: `https://api.oops.rest`
- **인증**: `X-OOPS-AUTH-TOKEN` 헤더에 토큰 전달

---

## 01. 일반 인증 인가

### 일반 회원가입

```
POST /api/v1/auth/credential-users/sign-up
```

**Request Body**

```json
{
  "username": "string", // required
  "password": "string", // required
  "name": "string", // required
  "nickname": "string" // required
}
```

**Response**: `204 No Content`

---

### 일반 유저 로그인

```
POST /api/v1/auth/credential-users/sign-in
```

**Request Body**

```json
{
  "username": "string", // required
  "password": "string" // required
}
```

**Response**: `200 OK`

```json
{
  "data": {
    "userId": 0,
    "accessToken": "string",
    "accessTokenExp": "2024-01-01T00:00:00",
    "refreshToken": "string",
    "refreshTokenExp": "2024-01-01T00:00:00"
  }
}
```

---

## 02. OAuth 인증 인가

### OAuth 회원 가입

```
POST /api/v1/oauth/{provider}/signup
```

**Path Parameters**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| provider | string | O | OAuth 제공자 (예: google, kakao) |

**Request Body**

```json
{
  "authorizationCode": "string", // required, minLength: 1
  "redirectUri": "string" // required, FE에서 사용한 redirect URI
}
```

**Response**: `201 Created`

```json
{
  "data": {
    "userId": 0,
    "tokens": {
      "accessToken": "string",
      "accessTokenExpiresAt": "2024-01-01T00:00:00",
      "refreshToken": "string",
      "refreshTokenExpiresAt": "2024-01-01T00:00:00"
    }
  }
}
```

---

### 가입 여부 확인

```
GET /api/v1/oauth/{provider}/signup/check
```

**Path Parameters**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| provider | string | O | OAuth 제공자 |

**Query Parameters**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| authorizationCode | string | O | OAuth 인가 코드 |

**Response**: `200 OK`

```json
{
  "data": {
    "isExists": true
  }
}
```

---

## 03. Guest 인증 인가

### Guest 유저 생성

```
POST /api/v1/auth/guest-users/sign-up
```

**Request Body**: 없음

**Response**: `201 Created`

```json
{
  "data": {
    "accessToken": "string",
    "userId": 0
  }
}
```

---

## 04. 인증 인가 공통

### 토큰 재발급

```
POST /api/v1/auth/token/refresh
```

**Request Body**

```json
{
  "accessToken": "string", // required
  "refreshToken": "string" // required
}
```

**Response**: `200 OK`

```json
{
  "data": {
    "accessToken": "string",
    "accessTokenExpiresAt": "2024-01-01T00:00:00",
    "refreshToken": "string",
    "refreshTokenExpiresAt": "2024-01-01T00:00:00"
  }
}
```

---

### 로그아웃

```
POST /api/v1/auth/logout
```

**Request Body**: 없음

**Response**: `204 No Content`

---

## 05. 회원 정보

### 내 정보 조회

```
GET /api/v1/my-info
```

**Response**: `200 OK`

```json
{
  "id": 0,
  "name": "string",
  "nickname": "string",
  "guest": true
}
```

---

## 06. 홈

### 홈 조회

```
GET /api/v1/home
```

**Response**: `200 OK`

```json
{
  "data": {
    "home": {
      "title": "string",
      "subTitle": "string"
    },
    "posts": [
      {
        "id": 0,
        "content": "string",
        "impactIntensity": 1,
        "category": "string",
        "customCategory": "string",
        "cause": "string",
        "feeling": "string",
        "postedAt": "2024-01-01T00:00:00"
      }
    ]
  }
}
```

---

## 07. 게시글

### 게시글 생성

```
POST /api/v1/posts
```

**Request Body**

```json
{
  "content": "string", // required, minLength: 1
  "impactIntensity": 1, // required, 1~5
  "categories": [
    // required
    { "category": "string", "customCategory": "string" }
  ],
  "cause": "string", // optional
  "feelings": ["string"], // required
  "postedAt": "2024-01-01T00:00:00" // optional, ISO 8601
}
```

**Response**: `201 Created`

```json
{
  "data": {
    "id": 0,
    "content": "string",
    "impactIntensity": 1,
    "categories": [{ "category": "string", "customCategory": "string" }],
    "cause": "string",
    "feelings": ["string"],
    "postedAt": "2024-01-01T00:00:00",
    "lastModifiedAt": "2024-01-01T00:00:00" // 또는 null (수정된 적 없으면)
  }
}
```

---

### 게시글 조회

```
GET /api/v1/posts/{postId}
```

**Path Parameters**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| postId | int64 | O | 게시글 ID |

**Response**: `200 OK`

```json
{
  "data": {
    "id": 0,
    "content": "string",
    "impactIntensity": 1,
    "categories": [{ "category": "string", "customCategory": "string" }],
    "cause": "string",
    "feelings": ["string"],
    "postedAt": "2024-01-01T00:00:00",
    "lastModifiedAt": "2024-01-01T00:00:00" // 또는 null (수정된 적 없으면)
  }
}
```

---

### 게시글 수정

```
PUT /api/v1/posts/{postId}
```

**Path Parameters**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| postId | int64 | O | 게시글 ID |

**Request Body**

```json
{
  "content": "string", // required, minLength: 1
  "impactIntensity": 1, // required, 1~5
  "categories": [{ "category": "string", "customCategory": "string" }], // required
  "cause": "string", // optional
  "feelings": ["string"], // required
  "postedAt": "2024-01-01T00:00:00" // optional, ISO 8601
}
```

**Response**: `200 OK`

```json
{
  "data": {
    "id": 0,
    "content": "string",
    "impactIntensity": 1,
    "categories": [{ "category": "string", "customCategory": "string" }],
    "cause": "string",
    "feelings": ["string"],
    "postedAt": "2024-01-01T00:00:00",
    "lastModifiedAt": "2024-01-01T00:00:00" // 또는 null (수정된 적 없으면)
  }
}
```

---

### 게시글 삭제

```
DELETE /api/v1/posts/{postId}
```

**Path Parameters**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| postId | int64 | O | 게시글 ID |

**Response**: `204 No Content`

---

### 이번주 게시글 및 요약 통계 조회

```
GET /api/v1/posts/weeks
```

**Response**: `200 OK`

> **Note**: 이 API는 `category`(단수), `feeling`(단수) 필드를 사용합니다.
> 상세 조회/생성/수정 API는 `categories`(복수), `feelings`(복수) 필드를 사용합니다.

```json
{
  "data": {
    "posts": [
      {
        "id": 0,
        "content": "string",
        "impactIntensity": 1,
        "category": [{ "category": "string", "customCategory": "string" }],
        "cause": "string",
        "feeling": ["string"],
        "postedAt": "2024-01-01T00:00:00+09:00",
        "lastModifiedAt": "2024-01-01T00:00:00+09:00"
      }
    ],
    "summary": {
      "category": "string",
      "categoryCount": 0
    }
  }
}
```

---

### 게시글 페이징 조회

```
GET /api/v1/posts
```

**Query Parameters**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| page | int32 | O | 페이지 번호 |
| size | int32 | O | 페이지 크기 |
| includeThisWeek | boolean | O | 이번주 게시글 포함 여부 |

**Response**: `200 OK` (내림차순 정렬)

```json
{
  "content": [
    {
      "id": 0,
      "content": "string",
      "impactIntensity": 1,
      "categories": [{ "category": "string", "customCategory": "string" }],
      "cause": "string",
      "feelings": ["string"],
      "postedAt": "2024-01-01T00:00:00",
      "lastModifiedAt": "2024-01-01T00:00:00" // 또는 null (수정된 적 없으면)
    }
  ],
  "page": 0,
  "size": 0,
  "totalPage": 0,
  "totalCount": 0
}
```

---

### 게시글 Config 조회

```
GET /api/v1/posts/configs
```

**Response**: `200 OK`

```json
{
  "data": {
    "minImpactIntensity": 1,
    "maxImpactIntensity": 5,
    "category": {
      "multipleSelectable": true,
      "categories": [
        "약속/일정",
        "선택/결정",
        "말/소통",
        "기대/결과 불일치",
        "직접 입력"
      ]
    },
    "cause": {
      "multipleSelectable": false,
      "causes": [
        "미루는 습관",
        "감정 기복",
        "체력 부족",
        "과한 기대",
        "판단 착오",
        "준비 부족"
      ]
    },
    "feeling": {
      "multipleSelectable": true,
      "feelings": ["답답함", "속상함", "서운함", "짜증", "불안", "후회"]
    }
  }
}
```

---

## 공통 스키마

### CategoryInfo

| 필드           | 타입   | 필수 | 설명            |
| -------------- | ------ | ---- | --------------- |
| category       | string | O    | 카테고리        |
| customCategory | string | X    | 커스텀 카테고리 |

### Post

| 필드            | 타입           | 필수 | 설명                              |
| --------------- | -------------- | ---- | --------------------------------- |
| id              | int64          | O    | 게시글 ID                         |
| content         | string         | O    | 게시글 내용                       |
| impactIntensity | int32          | O    | 영향 강도 (1~5)                   |
| categories      | CategoryInfo[] | O    | 카테고리 목록                     |
| cause           | string         | X    | 원인                              |
| feelings        | string[]       | O    | 감정 목록                         |
| postedAt        | datetime       | O    | 작성 일시 (ISO 8601, 타임존 포함) |
| lastModifiedAt  | datetime       | X    | 최종 수정 일시 (수정 시에만 존재) |

> **Note**: 이번주 게시글 조회 API(`/posts/weeks`)는 `category`, `feeling` (단수형)을 사용합니다.
> 상세 조회/생성/수정 API는 `categories`, `feelings` (복수형)을 사용합니다.

### Summary

| 필드          | 타입   | 필수 | 설명               |
| ------------- | ------ | ---- | ------------------ |
| category      | string | O    | 가장 많은 카테고리 |
| categoryCount | int32  | O    | 해당 카테고리 횟수 |

### TokenContext

| 필드                  | 타입     | 필수 | 설명                    |
| --------------------- | -------- | ---- | ----------------------- |
| accessToken           | string   | O    | 액세스 토큰             |
| accessTokenExpiresAt  | datetime | O    | 액세스 토큰 만료 시간   |
| refreshToken          | string   | O    | 리프레시 토큰           |
| refreshTokenExpiresAt | datetime | O    | 리프레시 토큰 만료 시간 |

### UserResponse

| 필드     | 타입    | 필수 | 설명        |
| -------- | ------- | ---- | ----------- |
| id       | int64   | O    | 유저 ID     |
| name     | string  | X    | 이름        |
| nickname | string  | X    | 닉네임      |
| guest    | boolean | O    | 게스트 여부 |
