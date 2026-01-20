// 게시글 기본 타입
export interface Post {
  id: number;
  content: string;
  impactIntensity: number;
  category?: string;
  customCategory?: string;
  cause?: string;
  feeling?: string;
  postedAt: string;
}

// 게시글 상세 응답 타입 (createdAt, modifiedAt 포함)
export interface PostResponse extends Post {
  createdAt: string;
  modifiedAt: string;
}

// 이번주 게시글 요약 통계
export interface Summary {
  totalCount: number;
  mostCategory?: string;
}

// 이번주 게시글 및 요약 응답
export interface PostWeekResponse {
  posts: Post[];
  summary: Summary;
}

// 게시글 페이징 응답
export interface PagePostResponse {
  content: PostResponse[];
  page: number;
  size: number;
  totalPage: number;
  totalCount: number;
}

// API 공통 응답 래퍼
export interface ApiResponse<T> {
  data: T;
}

// 게시글 생성 요청
export interface PostCreateRequest {
  content: string;
  impactIntensity: number;
  category?: string;
  customCategory?: string;
  cause?: string;
  feeling?: string;
  postedAt?: string; // ISO 8601 date-time
}

// 게시글 수정 요청
export interface PostUpdateRequest {
  content: string;
  impactIntensity: number;
  category?: string;
  customCategory?: string;
  cause?: string;
  feeling?: string;
  postedAt?: string; // ISO 8601 date-time
}

// 게시글 Config 응답
export interface PostConfig {
  minImpactIntensity: number;
  maxImpactIntensity: number;
  categories: string[];
  causes: string[];
  feelings: string[];
}
