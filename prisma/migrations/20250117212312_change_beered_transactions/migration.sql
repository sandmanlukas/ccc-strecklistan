/*
  Warnings:

  - The `beeredTransaction` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "beeredTransaction_old" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "beeredTransaction",
ADD COLUMN     "beeredTransaction" INTEGER;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_beeredTransaction_fkey" FOREIGN KEY ("beeredTransaction") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
