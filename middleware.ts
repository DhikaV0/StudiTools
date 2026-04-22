import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // hanya protect dashboard
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    // mapping role → base path
    const roleBasePath: Record<string, string> = {
      ADMIN: "/dashboard/admin",
      PETUGAS: "/dashboard/petugas",
      PEMINJAM: "/dashboard/peminjam",
    };

    const allowedBase = roleBasePath[role];

    if (!allowedBase) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // jika akses dashboard root → redirect otomatis
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(allowedBase, req.url));
    }

    // jika mencoba akses role lain
    if (!pathname.startsWith(allowedBase)) {
      return NextResponse.redirect(new URL(allowedBase, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};