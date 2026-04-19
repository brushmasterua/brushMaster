/*
  Warnings:

  - Added the required column `customerAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "customerAddress" TEXT NOT NULL,
ADD COLUMN     "customerCity" TEXT NOT NULL,
ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT NOT NULL,
ADD COLUMN     "deliveryMethod" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL;
