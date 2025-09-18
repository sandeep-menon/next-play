import { prisma } from "./prisma";
import axios from "axios";

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const TWITCH_AUTH_URL = process.env.TWITCH_AUTH_URL;

let cachedToken: null | string = null;
let cachedExpiry: number | Date | null = null;

async function fetchNewToken() {
    const url = `https://${TWITCH_AUTH_URL}?client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`;

    const res = await axios.post(url);
    const { access_token, expires_in } = res.data;
    const expiry = new Date(Date.now() + expires_in * 1000);

    // save token to db
    await prisma.twitchToken.upsert({
        where: { id: 1 },
        update: { token: access_token, expiry },
        create: { id: 1, token: access_token, expiry }
    });

    // saving token to application cache
    cachedToken = access_token;
    cachedExpiry = expiry;
    return cachedToken;
}

export async function getAccessToken() {
    if (cachedToken && cachedExpiry && cachedExpiry > new Date()) {
        // serving token from application cache
        return cachedToken;
    }

    const tokenRecord = await prisma.twitchToken.findUnique({ where: { id: 1 }});
    if (tokenRecord && tokenRecord.expiry > new Date()) {
        cachedToken = tokenRecord.token;
        cachedExpiry = tokenRecord.expiry;
        // serving token from db
        return cachedToken;
    }

    // fetching token from API
    return await fetchNewToken();
}

