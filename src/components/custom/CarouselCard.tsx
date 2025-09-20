import { GameType } from "@/shared/interface";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";

export default function CarouselCard({ game }: { game: GameType }) {

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const gameId = e.currentTarget.dataset.gameId;
        console.log("Game Id: ", gameId);
        // TODO: open game's homepage
    }

    return (
        <Card className="hover:cursor-pointer np-carousel-card flex-shrink-0 flex flex-col" data-game-id={game.id} onClick={handleCardClick}>
            <CardContent className="">
                <Image width={264} height={374} src={game.cover?.url} alt={game.name} className="object-cover" priority />
            </CardContent>
            <CardFooter>
                <p className="truncate" title={game.name}>
                    {game.name}
                </p>
            </CardFooter>
        </Card>
    )
}