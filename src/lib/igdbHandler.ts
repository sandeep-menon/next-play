import axios from "axios";
import { getAccessToken } from "./tokenManager";
import { getImageURL } from "./utils";
import { GameType } from "@/shared/interface";

export async function getTopRatedGames(offset: number): Promise<GameType[]> {
    const IGDB_URL = process.env.IGDB_URL;
    const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
    const token = await getAccessToken();

    const res = await axios.post(
        `https://${IGDB_URL}/games`,
        `fields name, cover.url; limit 10; offset ${offset}; sort rating desc;`,
        {
            headers: {
                "Client-ID": IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data.map((game: GameType) => ({
        ...game,
        cover: game.cover
            ? {
                ...game.cover,
                url: getImageURL(game.cover.url, "t_cover_big"),
            }
            : null
    }));
}