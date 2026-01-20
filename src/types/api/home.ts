import type { Post } from "./posts";

// 홈 정보
export interface Home {
  title: string;
  subTitle: string;
}

// 홈 상세 응답
export interface HomeDetailResponse {
  home: Home;
  posts: Post[];
}
