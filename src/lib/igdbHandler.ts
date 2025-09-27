import axios from "axios";
import { getAccessToken } from "./tokenManager";
import { getImageURL } from "./utils";
import { CompanyProps, GameType, SimilarGameType } from "@/shared/interface";

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
        `fields name, summary, storyline, cover.url, genres.name, first_release_date, involved_companies.developer,  involved_companies.publisher, involved_companies.company.name, involved_companies.company.websites.url, platforms.name, game_engines.name, rating, rating_count, artworks.url, screenshots.url,similar_games.cover.url, similar_games.name, similar_games.genres.name; where id=${id};`,
        {
            headers: {
                "Client-ID": IGDB_CLIENT_ID,
                Authorization: `Bearer ${token}`
            }
        }
    )
    if (res.data.length > 0) {
        const game = res.data[0];
        return {
            id: game.id,
            name: game.name,
            summary: game.summary,
            storyline: game.storyline ?? null,
            cover: getImageURL(game.cover.url, "t_cover_big"),
            genres: game.genres.map((g: { id: string; name: string }) => g.name),
            first_release_date: game.first_release_date * 1000,
            developers: getDevelopers(game.involved_companies),
            publishers: getPublishers(game.involved_companies),
            platforms: game.platforms.map((p: {id: string, name: string}) => p.name),
            game_engines: game.game_engines?.map((e: {id: string, name: string}) => e.name) ?? ["Proprietary"],
            rating: game.rating ?? 0,
            rating_count: game.rating_count ?? 0,
            artworks: game.artworks?.map((a: { id: string; url: string }) =>
                getImageURL(a.url, "t_1080p")
            ) ?? [],
            screenshots: game.screenshots?.map((s: {id: string, url: string}) => 
                getImageURL(s.url, "t_1080p")
            ) ?? [],
            similar_games: parseSimilarGames(game.similar_games) ?? []
        };
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

function getDevelopers(companies: CompanyProps[]) {
    const developers: { name: string; url: string; }[] = [];
    companies.forEach((company: CompanyProps) => {
        if (company.developer) {
            const temp = {
                name: company.company.name,
                url: company.company.websites?.map((website) => (website.url))[0],
            }
            developers.push(temp);
        }
    });

    return developers;
}

function getPublishers(companies: CompanyProps[]) {
    const publishers: { name: string; url: string }[] = [];
    companies.forEach((company: CompanyProps) => {
        if (company.publisher) {
            const temp = {
                name: company.company.name,
                url: company.company.websites?.map((website) => (website.url))[0],
            }
            publishers.push(temp);
        }
    });

    return publishers;
}

function parseSimilarGames(games: SimilarGameType[]) {
    const similar_games: { id: string, name: string, cover: string, genres: string[] }[] = [];
    games.forEach((game: SimilarGameType) => {
        const temp = {
            id: game.id,
            name: game.name,
            cover: getImageURL(game.cover.url, "t_cover_small") ?? "",
            genres: game?.genres.map((genre: { id: string, name: string}) => (genre.name))
        }
        similar_games.push(temp);
    });
    return similar_games;
}