"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useUserStore, type UserInfo } from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { toast } from "sonner";

interface NavbarProps {
    initialUser?: UserInfo | null;
}

export default function Navbar({ initialUser }: NavbarProps) {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (initialUser && !user) {
            setUser(initialUser, "");
        }
    }, [initialUser, user, setUser]);

    function handleProfileClick(): void {
        router.push("/profile");
    }

    async function handleLogout(): Promise<void> {
        const res = await fetch("/api/logout", {
            method: "POST",
            credentials: "include"
        });

        if (res.ok) {
            toast.success("Logged out");
            useUserStore.getState().clearUser();
            router.push("/explore");
        } else {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="max-w-[1280px] mx-auto px-4 py-2 flex justify-between items-center">
            <div className="text-lg font-bold">
                <Link href="/">Next Play</Link>
            </div>
            {pathname != "/" && <div className="flex items-center gap-2">
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarFallback>{user.avatar}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left" className="mt-4">
                            <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                ) : (
                    <Link href="/login">Login</Link>
                )}
            </div>}
        </div>
    );
}
