import { prisma } from "@/lib/prisma";
import { BorrowStatus } from "@prisma/client";

export class ReportService {
  static async getAll(params?: {
    startDate?: string | null;
    endDate?: string | null;
    status?: BorrowStatus | null;
  }) {
    const startDate = params?.startDate;
    const endDate = params?.endDate;
    const status = params?.status;

    return prisma.borrowing.findMany({
      where: {
        borrowDate: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
        status: status || undefined,
      },
      include: {
        user: true,
        items: {
          include: { tool: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}