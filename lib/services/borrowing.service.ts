import { prisma } from "@/lib/prisma";
import { BorrowingRepository } from "@/lib/repositories/borrowing.repository";
import { BorrowStatus } from "@prisma/client";

  export class BorrowingService {
static async getAll(skip: number, take: number) {
  try {
    console.log("Memulai getAll dengan skip:", skip, "take:", take);
    const [items, total] = await prisma.$transaction([
      prisma.borrowing.findMany({
        skip,
        take,
        include: {
          user: { 
            select: { 
              name: true, 
              username: true // Ganti email menjadi username
            } 
          },
          items: { include: { tool: true } }
        },
        orderBy: { borrowDate: 'desc' }
      }),
      prisma.borrowing.count()
    ]);

    return {
      data: items,
      meta: { total, skip, take }
    };
  } catch (error: any) {
    console.error("ERROR DI SERVICE GETALL:", error);
    throw error;
  }
}

  static async create(userId: string, data: any) {
    return await prisma.$transaction(async (tx) => {
      const itemsWithNames = [];
  
      for (const item of data.items) {
        const tool = await tx.tool.findUnique({
          where: { id: item.toolId },
        });
  
        if (!tool) throw new Error(`Alat ${item.toolId} tidak ditemukan`);
        
        const requestQty = Number(item.quantity);
        if (requestQty > tool.stockAvailable) throw new Error(`Stok ${tool.name} habis`);
  
        // Simpan data tool untuk snapshot
        itemsWithNames.push({
          toolId: item.toolId,
          quantity: requestQty,
          toolNameSnapshot: tool.name, // AMBIL NAMA ASLI DARI DATABASE
          conditionBefore: "GOOD"
        });
  
        // Kurangi stok
        await tx.tool.update({
          where: { id: item.toolId },
          data: { stockAvailable: { decrement: requestQty } },
        });
      }
  
      return await tx.borrowing.create({
        data: {
          userId,
          returnDue: new Date(data.returnDue),
          notes: data.notes,
          status: "PENDING",
          items: {
            create: itemsWithNames,
          },
        },
      });
    });
  }


  static async approve(borrowingId: string, approverId: string) {
    return prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId },
      });   
  
      if (!borrowing) throw new Error("Borrowing not found");
      if (borrowing.status !== "PENDING") throw new Error("Only pending borrowings can be approved");
  
      // Cukup update status saja, karena stok sudah dikurangi saat user melakukan POST (create)
      return tx.borrowing.update({
        where: { id: borrowingId },
        data: {
          status: "APPROVED",
          approvedById: approverId,
        },
      });
    });
  }

  static async reject(borrowingId: string, approverId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Ambil data peminjaman beserta item-itemnya
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId },
        include: { items: true },
      });
  
      if (!borrowing) throw new Error("Borrowing not found");
      
      // Pastikan hanya yang status PENDING yang bisa direject
      if (borrowing.status !== "PENDING") {
        throw new Error("Hanya peminjaman berstatus PENDING yang bisa ditolak");
      }
  
      // 2. Kembalikan stok untuk setiap item yang ada dalam peminjaman tersebut
      for (const item of borrowing.items) {
        await tx.tool.update({
          where: { id: item.toolId },
          data: {
            stockAvailable: { increment: item.quantity },
          },
        });
      }
  
      // 3. Update status menjadi REJECTED
      return tx.borrowing.update({
        where: { id: borrowingId },
        data: {
          status: "REJECTED",
          approvedById: approverId,
        },
      });
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