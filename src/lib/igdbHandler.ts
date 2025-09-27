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

export async function getGameDetails(id: string) {
    const IGDB_URL = process.env.IGDB_URL;
    const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
    const token = await getAccessToken();

    const res = await axios.post(
        `https://${IGDB_URL}/games`,
        `fields name, summary, cover.url, genres.name; where id=${id};`,
        {
            headers: {
                "Client-ID": IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`
            }
        }
    )
    if (res.data.length > 0) {
        return {
            id: res.data[0].id,
            name: res.data[0].name,
            summary: res.data[0].summary,
            cover: getImageURL(res.data[0].cover.url, "t_cover_big"),
            genres: res.data[0].genres.map((item: {id: string, name: string}) => (item.name))
        }
    }
}

export async function searchGame(name: string) {
    const IGDB_URL = process.env.IGDB_URL;
    const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
    const token = await getAccessToken();

    const res = await axios.post(
        `https://${IGDB_URL}/games`,
        `search "${name}"; fields name; limit 10;`,
        {
            headers: {
                "Client-ID": IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`
            }
        }
    )

    return res.data;
}