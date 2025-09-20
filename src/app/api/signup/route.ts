import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/schemas/auth";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = signupSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({
                error: "Validation failed",
                details: z.treeifyError(parsed.error)
            }, {
                status: 400
            })
        }

        const { email, username, password } = parsed.data;

        const existingUserWithEmail = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        const existingUserWithUsername = await prisma.user.findFirst({
            where: {
                username: username
            }
        });

        if (existingUserWithEmail || existingUserWithUsername) {
            return NextResponse.json({
                error: "Email or Username already exists"
            }, {
                status: 400
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: hashedPassword,
                initials: email.charAt(0).toUpperCase() + username.charAt(0).toUpperCase(),
                userConfig: {
                    "platforms": [],
                    "favourites": []
                }
            }
        });

        return NextResponse.json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                email,
                username
            }
        }, {
            status: 201
        })

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        })
    }
}