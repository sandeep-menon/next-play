import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (req.nextUrl.pathname.startsWith("/profile")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const payload = jwt.verify(token, JWT_SECRET);

            const newToken = jwt.sign({ user: payload }, JWT_SECRET, {
                expiresIn: "1h",
            });

            const res = NextResponse.next();
            res.cookies.set("token", newToken, {
                httpOnly: true,
                path: "/",
                maxAge: 3600,
                sameSite: "lax",
            })

            return res;
        } catch (error) {
            console.error("Middleware error: ", error);
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile"]
};