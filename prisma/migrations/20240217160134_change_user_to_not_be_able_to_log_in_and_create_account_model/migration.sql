/*
  Warnings:

  - The values [CCC,ADMIN,USER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isKadaver` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('CCC', 'ADMIN');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ORDFORANDE', 'KASSOR', 'BYGGCHEF', 'BILCHEF', 'GARDVAR', 'KLADCHEF', 'PROGRAMCHEF', 'ANNONSCHEF', 'MUSIKCHEF', 'OLCHEF', 'PRCHEF', 'KADAVER', 'OTHER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ORDFORANDE';
COMMIT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isKadaver",
ADD COLUMN     "position" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "role" SET DEFAULT 'ORDFORANDE';

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "AccountRole" NOT NULL DEFAULT 'CCC',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");
