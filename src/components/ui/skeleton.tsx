import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 둥근 모서리 스타일 */
  variant?: "default" | "rounded" | "circle";
}

export function Skeleton({
  className,
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-shimmer",
        {
          "rounded-md": variant === "default",
          "rounded-full": variant === "rounded" || variant === "circle",
        },
        className,
      )}
      {...props}
    />
  );
}
