import { NextRequest, NextResponse } from "next/server";
import { getTopRatedGames } from "@/lib/igdbHandler";



export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const offset =  Number(searchParams.get("offset") || 0);
        const data = await getTopRatedGames(offset);
        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}