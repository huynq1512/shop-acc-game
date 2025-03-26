import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (pathname.startsWith("/admin")) {
        if (!token || token.role !== "admin") {
            return NextResponse.redirect(new URL("/dang-nhap", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};