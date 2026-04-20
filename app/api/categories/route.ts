import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { CategoryService } from "@/lib/services/category.service";

export async function GET() {
  try {
    const data = await CategoryService.getAll();
    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const { name } = await req.json();
    const result = await CategoryService.create(name);

    return successResponse(result, 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN"]);

    const { id, name } = await req.json();
    const result = await CategoryService.update(id, name);

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
    const result = await CategoryService.delete(id);

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}