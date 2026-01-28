interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-gray-200 px-2 py-0.5">
      <span className="text-xs leading-[1.6] text-gray-700">{label}</span>
    </span>
  );
}

interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags, className = "" }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="태그 목록">
      {tags.map((tag, index) => (
        <li key={index}>
          <Tag label={tag} />
        </li>
      ))}
    </ul>
  );
}
