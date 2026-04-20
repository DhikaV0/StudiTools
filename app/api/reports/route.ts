import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { requireAuth, requireRole } from "@/lib/auth";
import { ReportService } from "@/lib/services/report.service";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN", "PETUGAS"]);

    const searchParams = req.nextUrl.searchParams;

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status") as any;

    const data = await ReportService.getAll({
      startDate,
      endDate,
      status,
    });

    return successResponse(data);
  } catch (err: any) {
    return errorResponse(err.message, 400);
  }
}