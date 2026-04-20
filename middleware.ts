import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && pathname.startsWith("/auth")) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as { role: string };

      if (decoded.role === "ADMIN" || decoded.role === "PETUGAS") {
        return NextResponse.redirect(
          new URL("/dashboard/admin", request.url)
        );
      }

      return NextResponse.redirect(
        new URL("/dashboard/peminjam", request.url)
      );
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};