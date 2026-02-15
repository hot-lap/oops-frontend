import { create } from "zustand";
import {
  createGuestUser,
  logout as logoutApi,
  getMyInfo,
  deleteAccount as deleteAccountApi,
} from "@/lib/api";

type UserType = "guest" | "user";

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
  loginAsUser: (userId: number) => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isInitialized: false,
  isLoading: false,
  userType: null,
  userId: null,
  error: null,

  /**
   * 앱 초기화 시 호출
   * - BFF의 /api/auth/me로 세션 상태 확인
   * - 세션 없으면 Guest 생성
   */
  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true, error: null });

    try {
      const myInfo = await getMyInfo();

      if (myInfo) {
        set({
          isInitialized: true,
          isLoading: false,
          userType: myInfo.userType,
          userId: myInfo.userId,
        });
      } else {
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
   * Guest 유저로 로그인 (BFF 경유)
   */
  loginAsGuest: async () => {
    set({ isLoading: true, error: null });

    try {
      const { userId } = await createGuestUser();

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
  loginAsUser: (userId: number) => {
    set({
      userType: "user",
      userId,
      error: null,
    });
  },

  /**
   * 로그아웃 (BFF 경유)
   * - 서버에서 세션 파기 + Guest 재생성
   */
  logout: async () => {
    set({ isLoading: true });

    try {
      const result = await logoutApi();
      set({
        isLoading: false,
        userType: result.userType,
        userId: result.userId,
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
      set({
        isLoading: false,
        userType: null,
        userId: null,
      });
    }
  },

  /**
   * 회원 탈퇴 (BFF 경유)
   * - 서버에서 탈퇴 처리 + Guest 재생성
   */
  deleteAccount: async () => {
    const result = await deleteAccountApi();
    set({
      userType: result.userType,
      userId: result.userId,
    });
  },
}));
