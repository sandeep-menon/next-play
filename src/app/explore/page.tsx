import { GameType } from "@/shared/interface";

export default async function ExplorePage() {
    
    const offset = 0;
    let games: GameType[] = [];
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-top-rated-games?offset=${offset}`, { next: { revalidate: 60 }});
    if (res.ok) {
        games = await res.json();
    }

    return (
        <div className="flex flex-col w-full">
            <div className="md:w-[1280px]">
                <div>Popular games</div>
                <div>
                    {games.map((game) => (
                        <div key={game.id}>{game.name}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}