"use server";

import { prisma } from "./db";

async function getUserTransactions(id: number) {
    const transactions = await prisma.transaction.findMany(
        {
            where: {
                userId: id,
            },
        }
    );
    return transactions;
}

export { getUserTransactions };