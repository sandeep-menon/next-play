import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { UserInfo } from "@/shared/interface";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let user: UserInfo | null = null;
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (typeof decoded === "object" && decoded != null) {
                user = decoded as UserInfo;
            }
        } catch (error) {
            console.error("Error while decoding token: ", error);
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        if (!user) {
            return NextResponse.json({ error: "Invalid payload token" }, { status: 400 });
        }

        const body = await req.json();
        const { id, initials } = body;

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        if (user.id !== id) {
            return NextResponse.json({ error: "Forbidded" }, { status: 403 });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                initials
            }
        });

        if (updatedUser) {
            const user = {
                id: updatedUser.id,
                username: updatedUser.username,
                avatar: updatedUser.initials,
                userConfig: updatedUser.userConfig
            }
            const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
            return NextResponse.json(
                { token, user, message: "Profile updated successfully" },
                {
                    headers: {
                        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`
                    }
                }
            )
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}