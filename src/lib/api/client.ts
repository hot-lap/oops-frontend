import ky, { type KyInstance } from "ky";
import toast from "react-hot-toast";

/**
 * ky 기반 API 클라이언트
 * - BFF 프록시를 통해 API 호출 (토큰은 서버 세션에서 자동 첨부)
 */
export const apiClient: KyInstance = ky.create({
  prefixUrl: "/api/proxy",
  retry: 0,
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
            window.location.reload();
          }
        }
        return response;
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;
        if (response) {
          try {
            const body = await response.json();
            const errorMessage =
              (body as { reason?: string }).reason ||
              "요청을 처리하는 중 오류가 발생했습니다.";

            if (typeof window !== "undefined") {
              toast.error(errorMessage);
            }

            error.message = errorMessage;
          } catch {
            // JSON 파싱 실패 시 기본 에러 메시지 사용
          }
        }
        return error;
      },
    ],
  },
});

/**
 * API 응답 타입 (data wrapper)
 */
export interface ApiResponse<T> {
  data: T;
}
