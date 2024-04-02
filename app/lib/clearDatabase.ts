"use server";

import { prisma } from '@/app/lib/db';

async function clearDatabase() {
    try {
        const deleteTransactions = prisma.transaction.deleteMany();
        const deleteSwish = prisma.swish.deleteMany();
        const nullifyEmailSentAt = prisma.debtCollect.updateMany({
            data: {
                emailSentAt: null
            }
        });

        await prisma.$transaction([deleteTransactions, deleteSwish, nullifyEmailSentAt]);
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }

}

export { clearDatabase };