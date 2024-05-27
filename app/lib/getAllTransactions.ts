"use server";

import { prisma } from "./db";

async function getAllTransactions(sort: boolean = false, date: Date | null = null) {
    const transactions = await prisma.transaction.findMany(
        {
            include: {
                item: true,
                user: true,
            },
            where: date ? { createdAt: { gte: date } } : undefined,
            orderBy: sort ? { createdAt: 'desc' } : undefined,
        }
    );
    return transactions;
}

export { getAllTransactions };