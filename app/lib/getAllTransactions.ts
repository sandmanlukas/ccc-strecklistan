"use server";

import { prisma } from "./db";

async function getAllTransactions() {
    const transactions = await prisma.transaction.findMany(
        {
            include: {
                item: true,
                user: true,
            },
        }
    );
    return transactions;
}

export { getAllTransactions };