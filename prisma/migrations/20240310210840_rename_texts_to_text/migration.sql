/*
  Warnings:

  - You are about to drop the `Texts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Texts";

-- CreateTable
CREATE TABLE "Text" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "Text_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Text_name_key" ON "Text"("name");
