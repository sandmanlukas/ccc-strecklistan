"use server";

import { prisma } from '@/app/lib/db';
import { TransactionWithItemAndUser } from '../components/StatsPage';

async function deleteTransaction(transaction: TransactionWithItemAndUser) {
    const transactionId = transaction.id;
    const userId = transaction.userId;
    const price = transaction.price;

    const beeredTransaction = transaction.beeredTransaction;
    const beeredUser = transaction.beeredUser;
    const beeredBy = transaction.beeredBy;

    try {
        const deleteTransaction = prisma.transaction.delete({
            where: {
                id: transactionId
            }
        });

        if (beeredTransaction) {
            // Delete the transaction of the user that beered.
            const deleteBeeredTransaction = prisma.transaction.delete({
                where: {
                    id: beeredTransaction
                }
            });

            // If the transaction is referring to a user that has been beered
            if (beeredBy) {
                // Update the beered by user's debt
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
                const deletedTransaction = await prisma.$transaction([deleteTransaction, updateUserDebt, deleteBeeredTransaction]);
                return deletedTransaction;
            }

            if (beeredUser) {
                // Update the beered user's debt
                const updateUserDebt = prisma.user.update(
                    {
                        where: {
                            username: beeredUser
                        },
                        data: {
                            debt: {
                                decrement: price,
                            }
                        }
                    }
                )
                const deletedTransaction = await prisma.$transaction([deleteTransaction, updateUserDebt, deleteBeeredTransaction]);
                return deletedTransaction;
            }

        } else {

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
        }
    } catch (error) {
        console.log('error', error);
        return null;
    }

}

export { deleteTransaction };