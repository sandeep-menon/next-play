"use client";

import { GameType } from "@/shared/interface";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ExplorePage() {
    const [games, setGames] = useState<GameType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/get-top-rated-games");
            if (res.status === 200) {
                const data = await res.json();
                setGames(data);
            } else {
                const data = await res.json();
                toast.error(data.error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-4">Popular Games</h2>
            {/* <h2 className="text-xl font-semibold mb-4">View All</h2> */}
            </div>

            {/* Mobile carousel */}
            <div className="flex gap-4 overflow-x-auto md:hidden pb-4">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="min-w-[200px] flex-shrink-0 bg-zinc-800 rounded-2xl shadow p-4"
                    >
                        <Image width={264} height={374} src={game.cover?.url} alt={game.name} className="rounded-lg mb-2" />
                        <div className="font-medium">{game.name}</div>
                    </div>
                ))}
            </div>

            {/* Desktop flex-wrap grid */}
            <div className="hidden md:flex md:flex-wrap md:gap-6">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="w-[230px] bg-zinc-800 rounded-2xl shadow p-4"
                    >
                        <Image width={264} height={374} src={game.cover?.url} alt={game.name} className="rounded-lg mb-2" />
                        <div className="font-medium">{game.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}