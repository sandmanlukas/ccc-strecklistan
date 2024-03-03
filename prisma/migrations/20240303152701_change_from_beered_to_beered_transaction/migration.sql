/*
  Warnings:

  - You are about to drop the column `beered` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "beered",
ADD COLUMN     "beeredTransaction" BOOLEAN NOT NULL DEFAULT false;
