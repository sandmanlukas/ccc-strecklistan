"use server";

import { prisma } from '@/app/lib/db';
import { BEERED_BARCODE } from './utils';

async function createTransaction(userId: number, beeredUserId: number | undefined, barcode: string) {
    try {
        const result = await prisma.$transaction(async (prisma) => {
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
                
                // Create a transaction for the user who beered the other user
                const transaction = await prisma.transaction.create({
                    data: {
                        userId: userId,
                        barcode: barcode,
                        beeredTransaction: true,
                        beeredUser: beeredUser?.username, // Which user was beered
                },
                    include: {
                        item: true,
                    },
                });
                
                // Update the beered user's debt
                await prisma.user.update({
                    where: {
                        id: beeredUserId,
                    },
                    data: {
                        debt: {
                            increment: transaction.item.price,
                        }
                    },
                });
                
                // Create a transaction for the beered user for statistics
                await prisma.transaction.create({
                    data: {
                        userId: beeredUserId,
                        barcode: BEERED_BARCODE,
                        beeredTransaction: true,
                        beeredBy: beeringUser?.username,
                        beeredPrice: transaction.item.price,
                    },
                    include: {
                        item: true,
                    },
                });

                return transaction;
            } else {
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