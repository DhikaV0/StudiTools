/*
  Warnings:

  - Added the required column `conditionBefore` to the `BorrowItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toolNameSnapshot` to the `BorrowItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FineType" AS ENUM ('LATE', 'DAMAGE', 'LOST');

-- CreateEnum
CREATE TYPE "FineStatus" AS ENUM ('UNPAID', 'PAID', 'WAIVED');

-- AlterEnum
ALTER TYPE "BorrowStatus" ADD VALUE 'OVERDUE';

-- AlterTable
ALTER TABLE "BorrowItem" ADD COLUMN     "conditionBefore" TEXT NOT NULL,
ADD COLUMN     "toolNameSnapshot" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Fine" (
    "id" TEXT NOT NULL,
    "borrowingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "FineType" NOT NULL,
    "description" TEXT,
    "status" "FineStatus" NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Fine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnTransaction" (
    "id" TEXT NOT NULL,
    "borrowingId" TEXT NOT NULL,
    "processedById" TEXT NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReturnTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnItem" (
    "id" TEXT NOT NULL,
    "returnTransactionId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "quantityReturned" INTEGER NOT NULL,
    "conditionAfter" TEXT NOT NULL,
    "fineAmount" DECIMAL(10,2),

    CONSTRAINT "ReturnItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReturnTransaction_borrowingId_key" ON "ReturnTransaction"("borrowingId");

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_borrowingId_fkey" FOREIGN KEY ("borrowingId") REFERENCES "Borrowing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnTransaction" ADD CONSTRAINT "ReturnTransaction_borrowingId_fkey" FOREIGN KEY ("borrowingId") REFERENCES "Borrowing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnTransaction" ADD CONSTRAINT "ReturnTransaction_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_returnTransactionId_fkey" FOREIGN KEY ("returnTransactionId") REFERENCES "ReturnTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
