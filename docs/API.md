# OOPS API 문서

## 기본 정보

- **Base URL**: `http://api.oops.rest`
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
  "authorizationCode": "string" // required, minLength: 1
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
  "data": {
    "id": 0,
    "name": "string",
    "nickname": "string",
    "isGuest": true
  }
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
  "category": "string", // required, minLength: 1
  "customCategory": "string", // optional
  "cause": "string", // required
  "feeling": "string" // required
}
```

**Response**: `201 Created`

```json
{
  "data": {
    "id": 0,
    "content": "string",
    "impactIntensity": 1,
    "category": "string",
    "customCategory": "string",
    "cause": "string",
    "feeling": "string",
    "postedAt": "2024-01-01T00:00:00",
    "createdAt": "2024-01-01T00:00:00",
    "modifiedAt": "2024-01-01T00:00:00"
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
    "category": "string",
    "customCategory": "string",
    "cause": "string",
    "feeling": "string",
    "postedAt": "2024-01-01T00:00:00",
    "createdAt": "2024-01-01T00:00:00",
    "modifiedAt": "2024-01-01T00:00:00"
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
  "category": "string", // required, minLength: 1
  "customCategory": "string", // optional
  "cause": "string", // required
  "feeling": "string" // required
}
```

**Response**: `200 OK`

```json
{
  "data": {
    "id": 0,
    "content": "string",
    "impactIntensity": 1,
    "category": "string",
    "customCategory": "string",
    "cause": "string",
    "feeling": "string",
    "postedAt": "2024-01-01T00:00:00",
    "createdAt": "2024-01-01T00:00:00",
    "modifiedAt": "2024-01-01T00:00:00"
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

```json
{
  "data": {
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
    ],
    "summary": {
      "totalCount": 0,
      "mostCategory": "string" // optional
    }
  }
}
```

---

### 게시글 페이징 조회

```
GET /api/v1/posts/posts
```

**Query Parameters**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| page | int32 | O | 페이지 번호 |
| includeThisWeek | boolean | O | 이번주 게시글 포함 여부 |

**Response**: `200 OK` (내림차순 정렬)

```json
{
  "content": [
    {
      "id": 0,
      "content": "string",
      "impactIntensity": 1,
      "category": "string",
      "customCategory": "string",
      "cause": "string",
      "feeling": "string",
      "postedAt": "2024-01-01T00:00:00",
      "createdAt": "2024-01-01T00:00:00",
      "modifiedAt": "2024-01-01T00:00:00"
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
    "categories": ["string"],
    "causes": ["string"],
    "feelings": ["string"]
  }
}
```

---

## 공통 스키마

### Post

| 필드            | 타입     | 필수 | 설명            |
| --------------- | -------- | ---- | --------------- |
| id              | int64    | O    | 게시글 ID       |
| content         | string   | O    | 게시글 내용     |
| impactIntensity | int32    | O    | 영향 강도 (1~5) |
| category        | string   | O    | 카테고리        |
| customCategory  | string   | X    | 커스텀 카테고리 |
| cause           | string   | O    | 원인            |
| feeling         | string   | O    | 감정            |
| postedAt        | datetime | O    | 작성 일시       |

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
| isGuest  | boolean | O    | 게스트 여부 |
