import { NextRequest } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth";
import { ReportService } from "@/lib/services/report.service";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN", "PETUGAS"]);

    const searchParams = req.nextUrl.searchParams;

    const type = searchParams.get("type");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status") as any;

    const borrowings = await ReportService.getBorrowingReport({
      startDate,
      endDate,
      status,
    });

    if (type !== "excel") {
      return new Response("Invalid type", { status: 400 });
    }

    const rows: any[] = [];

    borrowings.forEach((b) => {
      b.items.forEach((item) => {
        rows.push({
          ID: b.id,
          User: b.user.name,
          Tool: item.tool.name,
          Quantity: item.quantity,
          BorrowDate: b.borrowDate.toISOString(),
          ReturnDue: b.returnDue.toISOString(),
          Status: b.status,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    return new Response(buffer, {
      headers: {
        "Content-Disposition": "attachment; filename=report.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 400 });
  }
}