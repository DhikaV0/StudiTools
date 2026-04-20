import { prisma } from "@/lib/prisma";
import { BorrowingRepository } from "@/lib/repositories/borrowing.repository";
import { BorrowStatus } from "@prisma/client";

export class BorrowingService {
  static async getAll(skip: number, take: number) {
    const [data, total] = await Promise.all([
      BorrowingRepository.findAll(skip, take),
      BorrowingRepository.count(),
    ]);

    return { data, total };
  }

  static async create(userId: string, payload: any) {
    const { returnDue, notes, items } = payload;

    if (!items || items.length === 0)
      throw new Error("Borrow items required");

    return prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.create({
        data: {
          userId,
          returnDue: new Date(returnDue),
          notes,
          status: BorrowStatus.PENDING,
        },
      });

      for (const item of items) {
        const tool = await tx.tool.findUnique({
          where: { id: item.toolId },
        });

        if (!tool) throw new Error("Tool not found");

        if (tool.stockAvailable < item.quantity)
          throw new Error(`Insufficient stock for ${tool.name}`);

        await tx.borrowItem.create({
          data: {
            borrowingId: borrowing.id,
            toolId: item.toolId,
            quantity: item.quantity,
          },
        });
      }

      return borrowing;
    });
  }

  static async approve(borrowingId: string, approverId: string) {
    return prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId },
        include: { items: true },
      });

      if (!borrowing)
        throw new Error("Borrowing not found");

      if (borrowing.status !== BorrowStatus.PENDING)
        throw new Error("Only pending borrowings can be approved");

      for (const item of borrowing.items) {
        const tool = await tx.tool.findUnique({
          where: { id: item.toolId },
        });

        if (!tool || tool.stockAvailable < item.quantity)
          throw new Error("Stock insufficient during approval");

        await tx.tool.update({
          where: { id: item.toolId },
          data: {
            stockAvailable: tool.stockAvailable - item.quantity,
          },
        });
      }

      return tx.borrowing.update({
        where: { id: borrowingId },
        data: {
          status: BorrowStatus.APPROVED,
          approvedById: approverId,
        },
      });
    });
  }

  static async reject(borrowingId: string, approverId: string) {
    return prisma.borrowing.update({
      where: { id: borrowingId },
      data: {
        status: BorrowStatus.REJECTED,
        approvedById: approverId,
      },
    });
  }

  static async returnBorrowing(borrowingId: string) {
    return prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId },
        include: { items: true },
      });

      if (!borrowing)
        throw new Error("Borrowing not found");

      if (borrowing.status !== BorrowStatus.APPROVED)
        throw new Error("Only approved borrowings can be returned");

      for (const item of borrowing.items) {
        const tool = await tx.tool.findUnique({
          where: { id: item.toolId },
        });

        await tx.tool.update({
          where: { id: item.toolId },
          data: {
            stockAvailable: tool!.stockAvailable + item.quantity,
          },
        });
      }

      return tx.borrowing.update({
        where: { id: borrowingId },
        data: {
          status: BorrowStatus.RETURNED,
          returnDate: new Date(),
        },
      });
    });
  }
}