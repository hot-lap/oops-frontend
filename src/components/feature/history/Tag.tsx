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
