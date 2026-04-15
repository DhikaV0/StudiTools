import { NextResponse } from "next/server";
import { PrismaClient, BorrowStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await req.json();
    const borrowingId = params.id;

    const result = await prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId },
        include: { items: true },
      });

      if (!borrowing) {
        throw new Error("Borrowing tidak ditemukan");
      }

      if (action === "APPROVE") {
        if (borrowing.status !== "PENDING") {
          throw new Error("Sudah diproses");
        }

        // cek stok lagi sebelum approve
        for (const item of borrowing.items) {
          const tool = await tx.tool.findUnique({
            where: { id: item.toolId },
          });

          if (!tool || tool.stockAvailable < item.quantity) {
            throw new Error("Stock tidak cukup");
          }
        }

        // kurangi stok
        for (const item of borrowing.items) {
          await tx.tool.update({
            where: { id: item.toolId },
            data: {
              stockAvailable: {
                decrement: item.quantity,
              },
            },
          });
        }

        return tx.borrowing.update({
          where: { id: borrowingId },
          data: {
            status: BorrowStatus.APPROVED,
          },
        });
      }

      if (action === "REJECT") {
        return tx.borrowing.update({
          where: { id: borrowingId },
          data: {
            status: BorrowStatus.REJECTED,
          },
        });
      }

      if (action === "RETURN") {
        if (borrowing.status !== "APPROVED") {
          throw new Error("Belum di-approve");
        }

        // tambah stok kembali
        for (const item of borrowing.items) {
          await tx.tool.update({
            where: { id: item.toolId },
            data: {
              stockAvailable: {
                increment: item.quantity,
              },
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
      }

      if (action === "CANCEL") {
        return tx.borrowing.update({
          where: { id: borrowingId },
          data: {
            status: BorrowStatus.CANCELLED,
          },
        });
      }

      throw new Error("Action tidak valid");
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}