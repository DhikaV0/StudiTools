import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Action is required" },
        { status: 400 }
      );
    }

    // ======================
    // LOGIN
    // ======================
    if (action === "LOGIN") {
      const { username, password } = body;

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
        {
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

      const response = NextResponse.json({
        success: true,
        role: user.role,
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }

    // ======================
    // REGISTER
    // ======================
    if (action === "REGISTER") {
      const { name, username, password } = body;

      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Username already exists" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          username,
          password: hashedPassword,
          role: "PEMINJAM",
        },
      });

      return NextResponse.json({
        success: true,
        message: "User created",
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}