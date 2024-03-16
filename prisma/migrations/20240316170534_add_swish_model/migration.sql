-- CreateTable
CREATE TABLE "Swish" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "number" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Swish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Swish_number_key" ON "Swish"("number");
