import CarouselWrapper from "@/components/custom/CarouselWrapper";
import { Input } from "@/components/ui/input";
import { getTopRatedGames } from "@/lib/igdbHandler";
import { GameType } from "@/shared/interface";

export default async function ExplorePage() {
    const games: GameType[] = await getTopRatedGames(0);

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4 w-80 md:w-92 mx-auto py-2">
                <Input type="text" placeholder="Search" />
            </div>
            <div className="flex flex-col gap-4">
                <div className="text-lg font-semibold">Popular games</div>
                <div>
                    <CarouselWrapper initialContent={games} />
                </div>
            </div>
        </div>
    )
}