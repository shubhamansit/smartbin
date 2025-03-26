-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bin" (
    "id" TEXT NOT NULL,
    "fillLevel" INTEGER NOT NULL,
    "sensor" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "lastReported" TEXT NOT NULL,
    "binOwnerId" TEXT NOT NULL,

    CONSTRAINT "Bin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bin" ADD CONSTRAINT "Bin_binOwnerId_fkey" FOREIGN KEY ("binOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
