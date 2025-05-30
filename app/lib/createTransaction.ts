"use server";

import { prisma } from '@/app/lib/db';
import { BEERED_BARCODE } from '@/app/constants';
import { Transaction } from '@prisma/client';
import { TransactionWithItem } from '../components/UserPage';
async function createTransaction(userId: number, beeredUserId: number | undefined, barcode: string) {
    try {
        let freeBeer = false;

        const result = await prisma.$transaction(async (prisma) => {

            const item = await prisma.item.findUnique({
                where: {
                    barcode: barcode,
                },
            });

            if (!item) {
                throw new Error("Kunde inte hitta produkten.");
            }

            if (beeredUserId) {

                // Get beering user
                const beeringUser = await prisma.user.findUnique({
                    where: {
                        id: userId,
                    },
                });

                // Get beered user
                const beeredUser = await prisma.user.findUnique({
                    where: {
                        id: beeredUserId,
                    },
                });

                if (!beeringUser || !beeredUser) {
                    throw new Error("Kunde inte hitta användaren.");
                }

                // Create a transaction for the user who beered the other user
                let transaction = await prisma.transaction.create({
                    data: {
                        userId: userId,
                        barcode: barcode,
                        beeredTransaction: null, // First set the beeredTransaction to null
                        beeredUser: beeredUser.username, // Which user was beered
                        price: 0,
                    },
                    include: {
                        item: true,
                    },
                }) as TransactionWithItem;

                // Update the beered user's debt
                await prisma.user.update({
                    where: {
                        id: beeredUserId,
                    },
                    data: {
                        debt: {
                            increment: item.price,
                        }
                    },
                });

                // Create a transaction for the beered user for statistics
                const beeredUserTransaction = await prisma.transaction.create({
                    data: {
                        userId: beeredUserId,
                        barcode: BEERED_BARCODE,
                        beeredTransaction: transaction.id, // Set the beeredTransaction to the transaction id of the beering transaction
                        beeredBy: beeringUser.username,
                        price: item.price,
                    },
                    include: {
                        item: true,
                    },
                });

                // Update the beering transaction with the beered transaction id
                transaction = await prisma.transaction.update({
                    where: {
                        id: transaction.id,
                    },
                    data: {
                        beeredTransaction: beeredUserTransaction.id,
                    },
                    include: {
                        item: true,
                    },
                });

                return { transaction, freeBeer };
            } else {

                // Calculate if the user should get a free beer        
                if (Math.random() <= (1 - Number(process.env.FREE_BEER_PROBABILITY))) {
                    await prisma.user.update({
                        where: {
                            id: userId,
                        },
                        data: {
                            debt: {
                                increment: item.price,
                            },
                        },
                    });
                } else {
                    freeBeer = true;
                }

                const transaction = await prisma.transaction.create({
                    data: {
                        userId: userId,
                        barcode: barcode,
                        price: freeBeer ? 0 : item.price,
                    },
                    include: {
                        item: true,
                    },
                });
                return { transaction, freeBeer };
            }
        });
        console.log("Transaction created with item details, and user's debt updated");
        return result;
    } catch (error) {
        console.error("Error during transaction creation and updating user's debt:", error);
        throw error;
    }
}

export { createTransaction };