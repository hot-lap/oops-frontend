import { create } from "zustand";
import {
  getAccessToken,
  getRefreshToken,
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

export const useAuthStore = create<AuthState>((set, get) => ({
  // 초기 상태
  isInitialized: false,
  isLoading: false,
  userType: null,
  userId: null,
  error: null,

  /**
   * 앱 초기화 시 호출
   * - 기존 토큰이 있으면 유효성 검증 후 상태 복원
   * - 토큰이 유효하지 않으면 refreshToken으로 갱신 시도
   * - refreshToken도 없거나 갱신 실패 시 Guest 토큰 발급
   */
  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });

    try {
      const existingToken = getAccessToken();
      const existingRefreshToken = getRefreshToken();

      if (existingToken) {
        // 기존 토큰 있음 - 유효성 검증
        const myInfo = await getMyInfo(existingToken);

        if (myInfo) {
          // 토큰 유효함 - 상태 복원
          set({
            isInitialized: true,
            isLoading: false,
            userType: myInfo.isGuest ? "guest" : "user",
            userId: myInfo.userId,
          });
        } else if (existingRefreshToken) {
          // accessToken 유효하지 않지만 refreshToken 있음 - 갱신 시도
          console.warn("accessToken 유효하지 않음, 갱신 시도합니다.");
          const refreshSuccess = await get().refreshTokens();

          if (refreshSuccess) {
            // 갱신 성공 - 새 토큰으로 유저 정보 조회
            const newToken = getAccessToken();
            if (newToken) {
              const newMyInfo = await getMyInfo(newToken);
              if (newMyInfo) {
                set({
                  isInitialized: true,
                  isLoading: false,
                  userType: newMyInfo.isGuest ? "guest" : "user",
                  userId: newMyInfo.userId,
                });
                return;
              }
            }
          }
          // 갱신 실패 - Guest 토큰 발급
          clearTokens();
          await get().loginAsGuest();
          set({ isInitialized: true });
        } else {
          // refreshToken도 없음 - Guest 토큰 발급
          console.warn("토큰이 유효하지 않음, 새로 발급합니다.");
          clearTokens();
          await get().loginAsGuest();
          set({ isInitialized: true });
        }
      } else if (existingRefreshToken) {
        // accessToken 없지만 refreshToken 있음 - 갱신 시도
        console.warn("accessToken 없음, refreshToken으로 갱신 시도합니다.");
        const refreshSuccess = await get().refreshTokens();

        if (refreshSuccess) {
          // 갱신 성공 - 새 토큰으로 유저 정보 조회
          const newToken = getAccessToken();
          if (newToken) {
            const newMyInfo = await getMyInfo(newToken);
            if (newMyInfo) {
              set({
                isInitialized: true,
                isLoading: false,
                userType: newMyInfo.isGuest ? "guest" : "user",
                userId: newMyInfo.userId,
              });
              return;
            }
          }
        }
        // 갱신 실패 - Guest 토큰 발급
        clearTokens();
        await get().loginAsGuest();
        set({ isInitialized: true });
      } else {
        // 토큰 없음 - Guest 토큰 발급
        await get().loginAsGuest();
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error("Auth 초기화 실패:", error);
      set({
        isInitialized: true,
        isLoading: false,
        error: error instanceof Error ? error.message : "인증 초기화 실패",
      });
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
  loginAsUser: (accessToken: string, refreshToken: string, userId: number) => {
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
}));
