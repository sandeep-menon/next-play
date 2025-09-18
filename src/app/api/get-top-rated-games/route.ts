import { getAccessToken } from "@/lib/tokenManager";
import { NextResponse } from "next/server";
import axios from "axios";
import { getImageURL } from "@/lib/utils";
import { GameType } from "@/shared/interface";



export async function GET() {
    try {
    const IGDB_URL = process.env.IGDB_URL;
    const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
    const token = await getAccessToken();
    const res = await axios.post(
        `https://${IGDB_URL}/games`,
        "fields name, cover.url; limit 10; sort rating desc;",
        {
            headers: {
                "Client-ID": IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`
            }
        }
    )
    const data = res.data.map((game: GameType) => ({
        ...game,
        cover: game.cover
            ? {
                ...game.cover,
                url: getImageURL(game.cover.url, "t_cover_big")
            }
            : null,
    }));

    return NextResponse.json(data, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}