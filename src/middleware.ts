import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import { UserInfo } from "./shared/interface";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (req.nextUrl.pathname.startsWith("/profile")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            let user: UserInfo | null = null;
            const decoded = await jwtVerify(token, JWT_SECRET);
            if (typeof decoded === "object" && decoded != null && decoded.payload != null) {
                user = decoded.payload as unknown as UserInfo;
            }

            const newToken = await new SignJWT({ ...user })
                .setProtectedHeader({ alg: "HS256"})
                .setExpirationTime("1h")
                .sign(JWT_SECRET);

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