/*
  Warnings:

  - The values [DRINK,FOOD,OTHER] on the enum `ItemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItemType_new" AS ENUM ('DRYCK', 'MAT', 'ANNAT');
ALTER TABLE "Item" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "type" TYPE "ItemType_new" USING ("type"::text::"ItemType_new");
ALTER TYPE "ItemType" RENAME TO "ItemType_old";
ALTER TYPE "ItemType_new" RENAME TO "ItemType";
DROP TYPE "ItemType_old";
ALTER TABLE "Item" ALTER COLUMN "type" SET DEFAULT 'DRYCK';
COMMIT;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "type" SET DEFAULT 'DRYCK';
