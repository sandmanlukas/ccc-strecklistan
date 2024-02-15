-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('DRINK', 'FOOD', 'OTHER');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "type" "ItemType" NOT NULL DEFAULT 'DRINK',
ADD COLUMN     "volume" INTEGER NOT NULL DEFAULT 0;
