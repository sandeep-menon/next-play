"use client";
import { GameType } from "@/shared/interface";
import CarouselCard from "./CarouselCard";
import { Loader, MoveLeft, MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";


export default function CarouselWrapper({ initialContent }: { initialContent: GameType[] }) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [games, setGames] = useState<GameType[]>(initialContent);
    const [offset, setOffset] = useState(10);
    const [loading, setLoading] = useState(false);

    const scroll = (direction: string) => {
        if (carouselRef.current) {
            const scrollAmount = direction === "left" ? -280 : 280;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
        }
    }


    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;

        const handleScroll = async () => {
            if (!carouselRef.current || loading) return;

            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

            if (scrollLeft + clientWidth >= scrollWidth - 100) {
                setLoading(true);

                try {
                    const res = await fetch(`/api/get-top-rated-games?offset=${offset}`);
                    const data: GameType[] = await res.json();

                    if (data && data.length > 0) {
                        setGames((prev) => [...prev, ...data]);
                        setOffset((prev) => prev + 10);
                    }
                } catch (error) {
                    console.error("Failed to fetch more games: ", error);
                } finally {
                    setLoading(false);
                }
            }
        }

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [offset, loading]);

    return (
        <>
            <div ref={carouselRef} className="np-carousel px-4">
                {games.map((item) => (
                    <CarouselCard key={item.id} game={item} />
                ))}

                {loading && (
                    <div className="flex items-center justify-center min-w-[80px]">
                        <Loader className="animate-spin h-8 w-8 text-blue-400" />
                    </div>
                )}
            </div>
            <div className="hidden md:flex justify-start items-center gap-2 mt-4">
                <Button variant="outline" onClick={() => scroll("left")}><MoveLeft /></Button>
                <Button variant="outline" onClick={() => scroll("right")}><MoveRight /></Button>
            </div>
        </>

    )
}