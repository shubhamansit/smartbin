-- DropForeignKey
ALTER TABLE "Bin" DROP CONSTRAINT "Bin_binOwnerId_fkey";

-- AlterTable
ALTER TABLE "Bin" ALTER COLUMN "binOwnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Bin" ADD CONSTRAINT "Bin_binOwnerId_fkey" FOREIGN KEY ("binOwnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
