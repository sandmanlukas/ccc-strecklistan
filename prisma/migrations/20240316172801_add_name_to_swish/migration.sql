/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Swish` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Swish` table without a default value. This is not possible if the table is not empty.
  - Made the column `number` on table `Swish` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Swish_number_key";

-- AlterTable
ALTER TABLE "Swish" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "number" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Swish_name_key" ON "Swish"("name");
