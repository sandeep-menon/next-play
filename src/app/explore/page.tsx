import CarouselWrapper from "@/components/custom/CarouselWrapper";
import { Input } from "@/components/ui/input";
import { GameType } from "@/shared/interface";

export default async function ExplorePage() {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL;

    const offset = 0;
    let games: GameType[] = [];
    const res = await fetch(`${baseUrl}/api/get-top-rated-games?offset=${offset}`, { next: { revalidate: 60 } });
    if (res.ok) {
        games = await res.json();
    }

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