import type { ReactNode } from "react";

// 인증이 필요한 API를 사용하므로 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default function HistoryLayout({ children }: { children: ReactNode }) {
  return children;
}
