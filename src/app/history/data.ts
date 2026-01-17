import type { StaticImageData } from "next/image";

// 이모지 이미지 - Figma에서 export한 이미지로 대체 예정
// import emojiDefault from "@/assets/images/emoji-default.png";

// 임시 placeholder URL (이미지 파일로 대체 예정)
const PLACEHOLDER_EMOJI =
  "https://www.figma.com/api/mcp/asset/a3ae2e87-57e4-4992-a5dd-6ba1db5001a6";

export interface Record {
  id: number;
  date: string;
  datetime: string;
  title: string;
  content: string;
  tags: string[];
  emoji: string | StaticImageData;
  lastModified?: string;
  isPast?: boolean;
}

export const records: Record[] = [
  {
    id: 1,
    date: "12월 18일 (목)",
    datetime: "2025.12.18 (목) 23:09",
    title: "친구 만나러 가는데 버스를 놓쳤다.",
    content:
      "친구 만나러 가는데 버스를 놓쳤다. 30분이나 늦어버렸다. 미리미리 준비하고 일찍 나갈걸!",
    tags: ["약속/일정", "#지각"],
    emoji: PLACEHOLDER_EMOJI,
    lastModified: "2025.01.14 (수) 14:50",
  },
  {
    id: 2,
    date: "12월 18일 (목)",
    datetime: "2025.12.18 (목) 14:30",
    title: "회의에서 말이 엇갈렸다",
    content:
      "팀 회의에서 내 의견을 제대로 전달하지 못했다. 다음에는 미리 정리해서 말해야겠다.",
    tags: ["말/소통"],
    emoji: PLACEHOLDER_EMOJI,
  },
  {
    id: 3,
    date: "12월 17일 (수)",
    datetime: "2025.12.17 (수) 19:00",
    title: "친구 만나러 가는데 버스를 놓쳤다",
    content: "또 버스를 놓쳤다. 이번에는 10분 늦었다.",
    tags: [],
    emoji: PLACEHOLDER_EMOJI,
  },
];

export const pastRecords: Record[] = [
  {
    id: 4,
    date: "12월 13일 (일)",
    datetime: "2025.12.13 (일) 10:00",
    title: "친구 만나러 가는데 버스를 놓쳤다.",
    content: "주말에도 버스를 놓쳤다.",
    tags: ["약속/일정"],
    emoji: PLACEHOLDER_EMOJI,
    isPast: true,
  },
  {
    id: 5,
    date: "12월 13일 (일)",
    datetime: "2025.12.13 (일) 15:00",
    title: "친구 만나러 가는데 버스를 놓쳤다.",
    content: "오후에도 또...",
    tags: ["약속/일정"],
    emoji: PLACEHOLDER_EMOJI,
    isPast: true,
  },
];

export const allRecords = [...records, ...pastRecords];

export function getRecordById(id: number): Record | undefined {
  return allRecords.find((record) => record.id === id);
}

export const summary = {
  recordCount: 3,
  topCategory: "말/소통",
};
