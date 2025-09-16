import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json({
            error: "Username is required"
        }, {
            status: 400
        })
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            username: username
        }
    });

    if (existingUser) {
        return NextResponse.json({
            error: "User already exists"
        }, {
            status: 400
        })
    } else {
        return NextResponse.json({
            message: "Username available"
        }, {
            status: 200
        })
    }
}