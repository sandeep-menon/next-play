import { create } from "zustand";
import { UserInfo } from "@/shared/interface";
import { decodeJwt } from "jose";

interface UserState {
    user: UserInfo | null;
    token: string | null;
    setUser: (user: UserInfo, token: string) => void;
    updateUser: (partial: Partial<UserInfo>) => void;
    clearUser: () => void;
    isTokenExpired: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    token: null,
    setUser: (user: UserInfo, token: string) => set({ user, token }),
    updateUser: (partial) => 
        set((state) => ({
            user: state.user ? { ...state.user, ...partial } : state.user,
        })),
    clearUser: () => set({ user: null, token: null }),
    isTokenExpired: () => {
        const token = get().token;
        if (!token) return true;
        try {
            const { exp } = decodeJwt(token);
            if (!exp) return true;
            const now = Math.floor(Date.now() / 1000);
            return now >= exp;
        } catch {
            return true;
        }
    }
}));

export type { UserInfo };