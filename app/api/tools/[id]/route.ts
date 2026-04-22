// app/api/tools/[id]/route.ts
import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { ToolService } from "@/lib/services/tool.service";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const result = await ToolService.delete(params.id);
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}