import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth";

const FINE_PER_DAY = 5000;
const DAMAGE_FINE = 20000;

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req); // Pastikan ini di-await jika async
    requireRole(user, ["ADMIN", "PETUGAS"]);

    const { borrowingId, items, notes } = await req.json();

    // Menggunakan return untuk mengirim response dari luar transaction
    const result = await prisma.$transaction(async (tx) => {
      const borrowing = await tx.borrowing.findUnique({
        where: { id: borrowingId },
        include: { items: true },
      });

      if (!borrowing) throw new Error("Borrowing not found");
      if (borrowing.status !== "APPROVED") throw new Error("Borrowing not eligible for return");

      const now = new Date();

      // 1. Buat transaksi pengembalian
      const returnTx = await tx.returnTransaction.create({
        data: {
          borrowingId,
          processedById: user.userId,
          notes,
        },
      });

      let totalFine = 0;
      let fineType: "LATE" | "DAMAGE" | "LOST" = "LATE";

      // 2. Loop items untuk update stok dan cek kondisi
      for (const item of items) {
        // Validasi: pastikan jumlah yang dikembalikan tidak melebihi yang dipinjam
        const borrowedItem = borrowing.items.find(i => i.toolId === item.toolId);
        if (!borrowedItem || item.quantityReturned > borrowedItem.quantity) {
          throw new Error(`Invalid quantity for tool ID: ${item.toolId}`);
        }

        await tx.returnItem.create({
          data: {
            returnTransactionId: returnTx.id,
            toolId: item.toolId,
            quantityReturned: item.quantityReturned,
            conditionAfter: item.conditionAfter,
          },
        });

        await tx.tool.update({
          where: { id: item.toolId },
          data: {
            stockAvailable: { increment: item.quantityReturned },
          },
        });

        if (item.conditionAfter !== "GOOD") {
          totalFine += DAMAGE_FINE * item.quantityReturned;
          fineType = "DAMAGE";
        }
      }

      // 3. Hitung denda keterlambatan
      if (now > borrowing.returnDue) {
        const diffMs = now.getTime() - borrowing.returnDue.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        totalFine += diffDays * FINE_PER_DAY;
      }

      // 4. Simpan denda ke tabel Fine (Sesuaikan dengan schema.prisma)
      if (totalFine > 0) {
        await tx.fine.create({
          data: {
            borrowingId,
            amount: totalFine,
            type: "LATE", // Gunakan Enum FineType: LATE, DAMAGE, atau LOST
            description: "Denda keterlambatan atau kerusakan alat",
            status: "UNPAID", // Gunakan Enum FineStatus
          },
        });
      }

      // 5. Update status peminjaman
      await tx.borrowing.update({
        where: { id: borrowingId },
        data: {
          status: "RETURNED",
          returnDate: now,
        },
      });

      return { success: true, fine: totalFine };
    });

    return new Response(JSON.stringify(result), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, message: err.message }), { 
      status: 400 
    });
  }
}