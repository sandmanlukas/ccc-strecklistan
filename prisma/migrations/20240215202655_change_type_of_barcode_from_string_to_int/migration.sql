/*
  Warnings:

  - Changed the type of `barcode` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "barcode",
ADD COLUMN     "barcode" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");
