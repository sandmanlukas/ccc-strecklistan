/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Texts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Texts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Texts" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Texts_name_key" ON "Texts"("name");
