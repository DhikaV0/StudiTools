import { prisma } from "@/lib/prisma";

export class BorrowingRepository {
  static async findAll(skip: number, take: number) {
    return prisma.borrowing.findMany({
      skip,
      take,
      include: {
        user: true,
        approvedBy: true,
        items: {
          include: { tool: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async count() {
    return prisma.borrowing.count();
  }

  static async findById(id: string) {
    return prisma.borrowing.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }
}