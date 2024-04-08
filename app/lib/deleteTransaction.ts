"use server";

import { prisma } from '@/app/lib/db';

async function deleteTransaction(transactionId: number, userId: number, price: number) {
    try {
        const deleteTransaction = prisma.transaction.delete({
            where: {
                id: transactionId
            }
        });

        const updateUserDebt = prisma.user.update(
            {
                where: {
                    id: userId
                },
                data: {
                    debt: {
                        decrement: price,
                    }
                }
            }
        )

        const [_, deletedTransaction] = await prisma.$transaction([deleteTransaction, updateUserDebt]);
        return deletedTransaction;
    } catch (error) {
        console.log('error', error);
        return null;
    }

}

export { deleteTransaction };