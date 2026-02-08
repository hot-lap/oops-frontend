import Link from "next/link";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";

interface PastRecordItemProps {
  id: number;
  date: string;
  title: string;
}

export function PastRecordItem({ id, date, title }: PastRecordItemProps) {
  return (
    <Link href={`/history/${id}`} className="block w-full">
      <article className="flex w-full items-center gap-2.5 rounded-xl border border-gray-100 bg-white py-2.5 pl-4 pr-3 transition-colors hover:bg-gray-50">
        <div className="flex flex-1 min-w-0 items-center gap-3 leading-[1.6]">
          <time className="shrink-0 text-[13px] text-gray-500">{date}</time>
          <h3 className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-medium text-gray-700">
            {title}
          </h3>
        </div>
        <ChevronDownIcon aria-hidden="true" />
      </article>
    </Link>
  );
}
