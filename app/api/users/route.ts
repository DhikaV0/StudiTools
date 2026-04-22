import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { UserService } from "@/lib/services/user.service";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const data = await UserService.getAllUsers();
    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const body = await req.json();

    const newUser = await UserService.createUser(body);

    return successResponse(newUser);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    await UserService.deleteUser(params.id);

    return successResponse({ message: "User deleted" });
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}