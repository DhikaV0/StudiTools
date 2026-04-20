import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Action required" },
        { status: 400 }
      );
    }

    if (action === "LOGIN") {
      const { username, password } = body;

      if (!username || !password) {
        return NextResponse.json(
          { success: false, message: "Username and password required" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Invalid password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const response = NextResponse.json({
        success: true,
        role: user.role,
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }

    if (action === "REGISTER") {
      const { name, username, password } = body;

      if (!name || !username || !password) {
        return NextResponse.json(
          { success: false, message: "All fields required" },
          { status: 400 }
        );
      }

      const existing = await prisma.user.findUnique({
        where: { username },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, message: "Username already exists" },
          { status: 400 }
        );
      }

      const hashed = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          name,
          username,
          password: hashed,
          role: "PEMINJAM",
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}