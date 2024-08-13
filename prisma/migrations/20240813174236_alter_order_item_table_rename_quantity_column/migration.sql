/*
  Warnings:

  - You are about to drop the column `qunatity` on the `order_item` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `order_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "qunatity",
ADD COLUMN     "quantity" INTEGER NOT NULL;
