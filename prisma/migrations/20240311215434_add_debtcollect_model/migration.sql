-- CreateTable
CREATE TABLE "DebtCollect" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailSentAt" TIMESTAMP(3),

    CONSTRAINT "DebtCollect_pkey" PRIMARY KEY ("id")
);
