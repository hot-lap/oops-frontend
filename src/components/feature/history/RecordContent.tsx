import Image from "next/image";
import { Tag } from "./Tag";

interface RecordContentProps {
  emoji: string;
  datetime: string;
  content: string;
  tags: string[];
  lastModified?: string;
}

export function RecordContent({
  emoji,
  datetime,
  content,
  tags,
  lastModified,
}: RecordContentProps) {
  return (
    <>
      {/* Emoji */}
      <figure className="relative size-20 overflow-hidden rounded-full">
        <Image
          src={emoji}
          alt="기록 이모지"
          fill
          className="object-cover"
          unoptimized
        />
      </figure>

      {/* Datetime */}
      <h2 className="mt-4 w-full text-center text-[15px] font-semibold leading-[1.6] text-gray-900">
        <time>{datetime}</time>
      </h2>

      {/* Content */}
      <blockquote className="mt-4 min-h-40 w-full rounded-[20px] border border-gray-200 bg-white p-5">
        <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.6] text-gray-700">
          {content}
        </p>
      </blockquote>

      {/* Tags */}
      {tags.length > 0 && (
        <ul className="mt-4 flex w-full flex-wrap gap-2" aria-label="태그 목록">
          {tags.map((tag, index) => (
            <li key={index}>
              <Tag label={tag} />
            </li>
          ))}
        </ul>
      )}

      {/* Last Modified */}
      {lastModified && (
        <footer className="mt-4 w-full">
          <p className="text-xs leading-[1.6] text-gray-500">
            최종 수정: <time>{lastModified}</time>
          </p>
        </footer>
      )}
    </>
  );
}
