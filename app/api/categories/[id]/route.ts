// app/api/categories/[id]/route.ts
import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { CategoryService } from "@/lib/services/category.service"; // Pastikan service ini ada

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    await CategoryService.delete(params.id);
    return successResponse({ message: "Category deleted" });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}