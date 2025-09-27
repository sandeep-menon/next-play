"use client";

import Image from "next/image";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

interface GameListType {
    id: string;
    name: string;
    cover: string;
    genres: string[];
}



export default function GameList({ data }: { data: GameListType[] }) {
    const router = useRouter();

    const handleGameListClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const gameId = e.currentTarget.dataset.gameId;
        router.push(`/game/${gameId}`);
    }
    return (
        <div className="flex flex-col gap-4">
            {data.map((item) => (
                <div key={item.name} data-game-id={item.id} className="p-4 flex items-center gap-4 hover:bg-background/20 hover:cursor-pointer" role="button" onClick={handleGameListClick}>
                    <div className="min-w-[90px]">
                        <Image src={item.cover} alt={item.name} height={128} width={90} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="md:text-3xl text-xl">{item.name}</div>
                        <div className="flex gap-1 flex-wrap">
                            {item.genres.map((genre) => (
                                <Badge key={genre}>{genre}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}