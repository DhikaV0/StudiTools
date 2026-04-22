// app/api/users/[id]/route.ts
import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { UserService } from "@/lib/services/user.service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = requireAuth(req);
    requireRole(currentUser, ["ADMIN"]);

    await UserService.deleteUser(params.id);
    return successResponse({ message: "User deleted" });
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}