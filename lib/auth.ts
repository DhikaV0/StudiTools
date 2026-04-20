import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { errorResponse } from "./utils/response";

export type JwtUser = {
  userId: string;
  role: "ADMIN" | "PETUGAS" | "PEMINJAM";
};

export function verifyToken(token: string): JwtUser | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtUser;
  } catch {
    return null;
  }
}

export function getAuthUser(req: NextRequest): JwtUser | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(req: NextRequest): JwtUser {
  const user = getAuthUser(req);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export function requireRole(
  user: JwtUser,
  roles: Array<JwtUser["role"]>
) {
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
}

export async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId: string;
      role: string;
    };

    return decoded;
  } catch {
    return null;
  }
}