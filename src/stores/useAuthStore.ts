import { create } from "zustand";
import {
  getAccessToken,
  getRefreshToken,
  getUserType,
  saveGuestToken,
  saveUserTokens,
  clearTokens,
  type UserType,
} from "@/lib/auth/token";
import {
  createGuestUser,
  refreshTokens as refreshTokensApi,
  logout as logoutApi,
  getMyInfo,
} from "@/lib/api";

/** getMyInfo 반환 타입 */
type MyInfo = NonNullable<Awaited<ReturnType<typeof getMyInfo>>>;

interface AuthState {
  // 상태
  isInitialized: boolean;
  isLoading: boolean;
  userType: UserType | null;
  userId: number | null;
  error: string | null;

  // 액션
  initialize: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  loginAsUser: (
    accessToken: string,
    refreshToken: string,
    userId: number,
  ) => void;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  /** myInfo로 인증 상태 설정 */
  const setAuthState = (myInfo: MyInfo) => {
    // 클라이언트가 관리하는 쿠키를 primary source로 사용
    // (서버 API의 isGuest 응답이 부정확할 수 있음)
    const cookieUserType = getUserType();
    set({
      isInitialized: true,
      isLoading: false,
      userType: cookieUserType ?? (myInfo.isGuest ? "guest" : "user"),
      userId: myInfo.userId,
    });
  };

  /** Guest로 fallback */
  const fallbackToGuest = async () => {
    clearTokens();
    await get().loginAsGuest();
    set({ isInitialized: true });
  };

  /** 초기화 에러 처리 */
  const handleInitError = (error: unknown) => {
    console.error("Auth 초기화 실패:", error);
    set({
      isInitialized: true,
      isLoading: false,
      error: error instanceof Error ? error.message : "인증 초기화 실패",
    });
  };

  return {
    isInitialized: false,
    isLoading: false,
    userType: null,
    userId: null,
    error: null,

    /**
     * 앱 초기화 시 호출
     * 1. accessToken으로 유저 정보 조회 시도
     * 2. 실패 시 refreshToken으로 갱신 후 재시도
     * 3. 모두 실패 시 Guest 토큰 발급
     */
    initialize: async () => {
      if (get().isInitialized) return;
      set({ isLoading: true, error: null });

      try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        // 1. accessToken으로 유저 정보 조회 시도
        let myInfo = accessToken ? await getMyInfo(accessToken) : null;

        // 2. 실패 시 refreshToken으로 갱신 후 재시도
        if (!myInfo && refreshToken) {
          const refreshed = await get().refreshTokens();
          if (refreshed) {
            const newToken = getAccessToken();
            myInfo = newToken ? await getMyInfo(newToken) : null;
          }
        }

        // 3. 결과에 따라 상태 설정
        if (myInfo) {
          setAuthState(myInfo);
        } else {
          await fallbackToGuest();
        }
      } catch (error) {
        handleInitError(error);
      }
    },

    /**
     * Guest 유저로 로그인
     */
    loginAsGuest: async () => {
      set({ isLoading: true, error: null });

      try {
        const { accessToken, userId } = await createGuestUser();
        saveGuestToken(accessToken);

        set({
          isLoading: false,
          userType: "guest",
          userId,
        });
      } catch (error) {
        console.error("Guest 로그인 실패:", error);
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : "Guest 로그인 실패",
        });
        throw error;
      }
    },

    /**
     * 일반 유저로 로그인 (OAuth 인증 성공 후 호출)
     */
    loginAsUser: (
      accessToken: string,
      refreshToken: string,
      userId: number,
    ) => {
      // 기존 Guest 토큰 삭제 후 User 토큰 저장
      clearTokens();
      saveUserTokens(accessToken, refreshToken);

      set({
        userType: "user",
        userId,
        error: null,
      });
    },

    /**
     * 로그아웃
     * - User 토큰 삭제
     * - Guest 토큰 재발급
     */
    logout: async () => {
      set({ isLoading: true });

      try {
        const token = getAccessToken();
        if (token) {
          await logoutApi(token);
        }
      } catch (error) {
        // 로그아웃 API 실패해도 계속 진행
        console.error("로그아웃 API 실패:", error);
      }

      // 토큰 삭제
      clearTokens();

      // Guest 토큰 재발급
      try {
        await get().loginAsGuest();
      } catch {
        set({
          isLoading: false,
          userType: null,
          userId: null,
        });
      }
    },

    /**
     * 토큰 갱신 (User만 해당)
     * @returns 갱신 성공 여부
     */
    refreshTokens: async () => {
      const refreshToken = getRefreshToken();

      // refreshToken만 있어도 갱신 시도 가능
      if (!refreshToken) {
        return false;
      }

      try {
        const newTokens = await refreshTokensApi(refreshToken);
        // accessToken과 refreshToken 모두 갱신
        saveUserTokens(newTokens.accessToken, newTokens.refreshToken);
        return true;
      } catch (error) {
        console.error("토큰 갱신 실패:", error);
        // 갱신 실패 시 토큰만 삭제 (logout 호출하면 순환 발생 가능)
        return false;
      }
    },
  };
});
