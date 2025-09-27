import CarouselWrapper from "@/components/custom/CarouselWrapper";
import SearchBox from "@/components/custom/SearchBox";
import { getTopRatedGames } from "@/lib/igdbHandler";
import { GameType } from "@/shared/interface";

export default async function ExplorePage() {
    const games: GameType[] = await getTopRatedGames(0);

    return (
        <div className="flex flex-col gap-4 w-full">
            <SearchBox />
            <div className="flex flex-col gap-4">
                <div className="text-lg font-semibold">Popular games</div>
                <div>
                    <CarouselWrapper initialContent={games} />
                </div>
            </div>
        </div>
    )
}