import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { UserService } from "@/lib/services/user.service";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const data = await UserService.getAll();
    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 403);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const { userId, role } = await req.json();

    const result = await UserService.updateRole(userId, role);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}