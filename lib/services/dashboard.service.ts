import { prisma } from "@/lib/prisma";
import { BorrowStatus } from "@prisma/client";

export class DashboardService {
  static async getAdminOverview() {
    const [
      totalUsers,
      totalTools,
      totalBorrowings,
      pendingBorrowings,
      approvedBorrowings,
      returnedBorrowings,
      recentBorrowings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.tool.count(),
      prisma.borrowing.count(),
      prisma.borrowing.count({ where: { status: BorrowStatus.PENDING } }),
      prisma.borrowing.count({ where: { status: BorrowStatus.APPROVED } }),
      prisma.borrowing.count({ where: { status: BorrowStatus.RETURNED } }),
      prisma.borrowing.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          items: {
            include: { tool: true },
          },
        },
      }),
    ]);

    const returnRate =
      totalBorrowings === 0
        ? 0
        : Math.round((returnedBorrowings / totalBorrowings) * 100);

    return {
      stats: {
        totalUsers,
        totalTools,
        totalBorrowings,
        pendingBorrowings,
        approvedBorrowings,
        returnRate,
      },
      recentBorrowings,
    };
  }
}