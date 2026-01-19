import { create } from "zustand";
import {
  getAccessToken,
  getRefreshToken,
  saveGuestToken,
  saveUserTokens,
  clearTokens,
  updateAccessToken,
  type UserType,
} from "@/lib/auth/token";
import {
  createGuestUser,
  refreshTokens as refreshTokensApi,
  logout as logoutApi,
  getMyInfo,
} from "@/lib/api/auth";

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
   * - 토큰이 유효하지 않으면 삭제 후 Guest 토큰 재발급
   * - 토큰이 없으면 Guest 토큰 발급
   */
  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });

    try {
      const existingToken = getAccessToken();

      if (existingToken) {
        // 기존 토큰 있음 - 유효성 검증
        const myInfo = await getMyInfo(existingToken);

        if (myInfo) {
          // 토큰 유효함 - 상태 복원
          set({
            isInitialized: true,
            isLoading: false,
            userType: myInfo.type === "GUEST" ? "guest" : "user",
            userId: myInfo.userId,
          });
        } else {
          // 토큰 유효하지 않음 - 삭제 후 Guest 토큰 재발급
          console.warn("토큰이 유효하지 않음, 새로 발급합니다.");
          clearTokens();
          await get().loginAsGuest();
          set({ isInitialized: true });
        }
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
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken || !refreshToken) {
      return false;
    }

    try {
      const newTokens = await refreshTokensApi(accessToken, refreshToken);
      updateAccessToken(newTokens.accessToken);
      return true;
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      // 갱신 실패 시 로그아웃 처리
      await get().logout();
      return false;
    }
  },
}));
