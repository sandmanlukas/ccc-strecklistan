"use server";

import { prisma } from "./db";

async function getAllTransactionsWithoutBeeredUser(sort: boolean = false, date: Date | null = null, take: number | null = null, skip: number | null = null) {

    const transactions = await prisma.transaction.findMany(
        {
            take: take || undefined,
            skip: skip || undefined,
            include: {
                item: true,
                user: true,
            },
            where: {
                AND: [
                    { beeredUser: null },
                    date ? { createdAt: { gte: date } } : {},
                ]
            },
            orderBy: sort ? { createdAt: 'desc' } : undefined,
        }
    );
    return transactions;
}

export { getAllTransactionsWithoutBeeredUser };