import { useSuspenseQuery } from "@tanstack/react-query";
import { getHome } from "@/lib/api/home";

export const homeKeys = {
  all: ["home"] as const,
  detail: () => [...homeKeys.all, "detail"] as const,
};

// 홈 조회 (Suspense)
export function useSuspenseHome() {
  return useSuspenseQuery({
    queryKey: homeKeys.detail(),
    queryFn: getHome,
  });
}
