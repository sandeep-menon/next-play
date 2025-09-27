import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        { message: "Logged out" },
        {
            headers: {
                "Set-Cookie": `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
            }
        }
    )
}