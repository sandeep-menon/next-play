import { Badge } from "@/components/ui/badge";
import { getGameDetails } from "@/lib/igdbHandler";
import Image from "next/image";

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const gameDetails = await getGameDetails(id);
    if (typeof gameDetails === "undefined" || gameDetails == null) {
        return (
            <div className="h-screen flex justify-center items-center gap-4">
                <div className="text-xl font-bold">404</div>
                <div>|</div>
                <div>Page not found</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-3xl text-balance text-center">{gameDetails.name}</div>
            <div>
                <Image src={gameDetails.cover || "placeholder_cover.png"} height={374} width={264} alt={gameDetails.name} className="border rounded-md" />
            </div>
            <div className="flex gap-2">
                {gameDetails.genres.map((item: string) => (
                    <Badge key={item}>{item}</Badge>
                ))}
            </div>
            <div className="text-center text-balance">{gameDetails.summary}</div>
        </div>

    )
}