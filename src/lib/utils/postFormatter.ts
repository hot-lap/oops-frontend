import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import type { Post, PostResponse } from "@/types/api/posts";
import { EMOTION_SCORES } from "@/constants/constants";

// UI에서 사용할 게시글 형태
export interface FormattedPost {
  id: number;
  date: string; // "12월 18일 (목)"
  datetime: string; // "2025.12.18 (목) 23:09"
  title: string;
  content: string;
  tags: string[];
  emoji: string;
  lastModified?: string;
  impactIntensity: number;
}

// impactIntensity (1~5)에 해당하는 emotion 이미지 반환
function getEmotionEmoji(impactIntensity: number): string {
  const index = Math.max(
    0,
    Math.min(impactIntensity - 1, EMOTION_SCORES.length - 1),
  );
  return EMOTION_SCORES[index].img;
}

// 날짜 포맷팅: "12월 18일 (목)"
function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "M월 d일 (E)", { locale: ko });
}

// 날짜시간 포맷팅: "2025.12.18 (목) 23:09"
function formatDateTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "yyyy.MM.dd (E) HH:mm", { locale: ko });
}

// 제목 추출: content의 첫 줄 또는 앞 50자
function extractTitle(content: string): string {
  const firstLine = content.split("\n")[0];
  if (firstLine.length <= 50) {
    return firstLine;
  }
  return firstLine.slice(0, 50) + "...";
}

// 태그 생성: categories, cause, feelings 조합
function createTags(post: Post): string[] {
  const tags: string[] = [];

  // categories 배열에서 태그 추출
  if (post.categories && post.categories.length > 0) {
    post.categories.forEach((cat) => {
      if (cat.customCategory) {
        // customCategory가 있으면 '#' 붙여서 표시
        tags.push(`#${cat.customCategory}`);
      } else if (cat.category) {
        tags.push(cat.category);
      }
    });
  }

  // cause 추가
  if (post.cause) {
    tags.push(post.cause);
  }

  // feelings 배열에서 태그 추출
  if (post.feelings && post.feelings.length > 0) {
    tags.push(...post.feelings);
  }

  return tags;
}

// Post를 UI용 FormattedPost로 변환
export function formatPost(post: Post): FormattedPost {
  return {
    id: post.id,
    date: formatDate(post.postedAt),
    datetime: formatDateTime(post.postedAt),
    title: extractTitle(post.content),
    content: post.content,
    tags: createTags(post),
    emoji: getEmotionEmoji(post.impactIntensity),
    impactIntensity: post.impactIntensity,
  };
}

// PostResponse를 UI용 FormattedPost로 변환 (lastModified 포함)
export function formatPostResponse(post: PostResponse): FormattedPost {
  return {
    ...formatPost(post),
    lastModified: formatDateTime(post.modifiedAt),
  };
}

// Post 배열을 FormattedPost 배열로 변환
export function formatPosts(posts: Post[] | undefined | null): FormattedPost[] {
  if (!posts) return [];
  return posts.map(formatPost);
}

// PostResponse 배열을 FormattedPost 배열로 변환
export function formatPostResponses(
  posts: PostResponse[] | undefined | null,
): FormattedPost[] {
  if (!posts) return [];
  return posts.map(formatPostResponse);
}
