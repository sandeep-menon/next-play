import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({
            error: "Username and password required"
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
        const match = await bcrypt.compare(password, existingUser.password);
        if (match) {
            const user = {
                id: existingUser.id,
                username: existingUser.username,
                avatar: existingUser.initials,
                userConfig: existingUser.userConfig
            }
            const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
            return NextResponse.json(
                { token, user },
                {
                    headers: {
                        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`
                    }
                }
            )
        } else {
            return NextResponse.json({
                error: "Username or password incorrect"
            }, {
                status: 401
            });
        }
    } else {
        return NextResponse.json({
            error: "Username not found"
        }, {
            status: 400
        })
    }
    
}