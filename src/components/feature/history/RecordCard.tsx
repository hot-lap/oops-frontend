import Link from "next/link";
import { TagList } from "./Tag";

interface RecordCardProps {
  id: number;
  date: string;
  title: string;
  tags: string[];
}

export function RecordCard({ id, date, title, tags }: RecordCardProps) {
  return (
    <Link href={`/history/${id}`} className="block w-full">
      <article className="flex w-full flex-col gap-1 rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50">
        <div className="flex w-full flex-col gap-1 px-0.5 leading-[1.6]">
          <time className="text-[13px] text-gray-500">{date}</time>
          <h3 className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold text-gray-900">
            {title}
          </h3>
        </div>
        <TagList tags={tags} className="pt-2" />
      </article>
    </Link>
  );
}
