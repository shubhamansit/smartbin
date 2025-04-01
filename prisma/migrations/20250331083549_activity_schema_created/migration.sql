-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "binId" TEXT NOT NULL,
    "fillLevel" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_binId_fkey" FOREIGN KEY ("binId") REFERENCES "Bin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
