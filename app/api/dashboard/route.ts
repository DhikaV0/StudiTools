import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { DashboardService } from "@/lib/services/dashboard.service";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN", "PETUGAS"]);

    const data = await DashboardService.getAdminOverview();

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}