import GameList from "@/components/custom/GameList";
import ImageGallery from "@/components/custom/ImageGallery";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGameDetails } from "@/lib/igdbHandler";
import { Info } from "lucide-react";
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
            <div className="flex gap-2 text-balance flex-wrap items-center justify-center">
                {gameDetails.genres.map((item: string) => (
                    <Badge key={item}>{item}</Badge>
                ))}
            </div>
            <div className="w-full md:w-3xl">
                <Tabs defaultValue="about">
                    <TabsList className="w-full">
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="similar">Similar</TabsTrigger>
                    </TabsList>
                    <TabsContent value="about">
                        <Card className="py-0">
                            <CardContent>
                                <div className="mt-4">
                                    <span className="text-sm font-semibold">Release date: </span>
                                    <span className="text-sm">{new Date(gameDetails.first_release_date).toDateString()}</span>
                                </div>
                                <div className="mt-4">
                                    <div className="text-sm font-semibold">Rating:</div>
                                    {gameDetails.rating == 0 ? (
                                        <div className="text-sm flex items-center gap-2"><Info className="h-4 w-4" />Awaiting reviews from the community</div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl font-semibold">{gameDetails.rating.toFixed(2) + "%"}</div>
                                            <Progress value={gameDetails.rating} />
                                            <div className="text-sm font-semibold">({gameDetails.rating_count})</div>
                                        </div>
                                    )}
                                </div>
                                <Accordion type="single" defaultValue="summary">
                                    <AccordionItem value="summary">
                                        <AccordionTrigger>Summary</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-2">
                                            <p className="text-justify">{gameDetails.summary}</p>
                                            <p className="text-justify">{gameDetails.storyline}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="details">
                                        <AccordionTrigger>More details:</AccordionTrigger>
                                        <AccordionContent className="flex gap-4 flex-col md:flex-row md:justify-around md:flex-wrap">
                                            <div className="flex flex-col">
                                                <div className="font-semibold">Developed by:</div>
                                                {gameDetails.developers.length == 0 ?
                                                    (<div>-</div>)
                                                    : (
                                                        <div>
                                                            {gameDetails.developers.map((dev) => (
                                                                <div key={dev.name}>{dev.name}</div>
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="font-semibold">Published by:</div>
                                                {gameDetails.publishers.length == 0 ?
                                                    (<div>-</div>)
                                                    : (
                                                        <div>
                                                            {gameDetails.publishers.map((pub) => (
                                                                <div key={pub.name}>{pub.name}</div>
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="font-semibold">Platforms:</div>
                                                {gameDetails.platforms.length == 0 ?
                                                    (<div>-</div>)
                                                    : (
                                                        <div>
                                                            {gameDetails.platforms.map((item: string) => (
                                                                <div key={item}>{item}</div>
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="font-semibold">Game Engine(s):</div>
                                                {gameDetails.game_engines.length == 0 ?
                                                    (<div>-</div>)
                                                    : (
                                                        <div>
                                                            {gameDetails.game_engines.map((engine: string) => (
                                                                <div key={engine}>{engine}</div>
                                                            ))}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="media">
                        <Card className="py-0">
                            <CardContent>
                                <Accordion type="single" defaultValue="artworks">
                                    <AccordionItem value="artworks">
                                        <AccordionTrigger>Artworks:</AccordionTrigger>
                                        <AccordionContent className="flex gap-2">
                                            {gameDetails.artworks.length > 0 ? (
                                                <ImageGallery data={gameDetails.artworks} />
                                            ) : (
                                                <div className="text-sm flex items-center gap-2"><Info className="h-4 w-4" />No artworks available yet.</div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="details">
                                        <AccordionTrigger>Screenshots:</AccordionTrigger>
                                        <AccordionContent className="flex gap-2">
                                            {gameDetails.screenshots.length > 0 ? (
                                                <ImageGallery data={gameDetails.screenshots} />
                                            ) : (
                                                <div className="text-sm flex items-center gap-2"><Info className="h-4 w-4" />No screenshots available yet.</div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="similar">
                        <Card>
                            <CardContent>
                                <GameList data={gameDetails.similar_games} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

        </div>

    )
}