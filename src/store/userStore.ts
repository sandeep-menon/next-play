import { create } from "zustand";
import { UserInfo } from "@/shared/interface";

interface UserState {
    user: UserInfo | null;
    setUser: (user: UserInfo) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user: UserInfo) => set({ user }),
    clearUser: () => set({ user: null }),
}));

export type { UserInfo };