import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { ToolService } from "@/lib/services/tool.service";

export async function GET() {
  try {
    const data = await ToolService.getAll();
    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const body = await req.json();
    const result = await ToolService.create(body);

    return successResponse(result, 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const { id, ...payload } = await req.json();
    const result = await ToolService.update(id, payload);

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const { id } = await req.json();
    const result = await ToolService.delete(id);

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}