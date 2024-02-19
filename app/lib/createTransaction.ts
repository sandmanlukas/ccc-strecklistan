"use server";

import { prisma } from '@/app/lib/db';

async function createTransaction(userId: number, barcode: string) {
    try {
        const result = await prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.create({
                data: {
                    userId: userId,
                    barcode: barcode,
                },
                include: {
                    item: true,
                },
            });

            await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    debt: {
                        increment: transaction.item.price,
                    }
                },
            });
            
            return transaction;
        });
        console.log("Transaction created with item details, and user's debt updated");
        return result;
    } catch (error) {
        console.error("Error during transaction creation and updating user's debt:", error);
        throw error;
    }
}

export { createTransaction };