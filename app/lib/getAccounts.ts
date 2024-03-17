"use server";

import { prisma } from '@/app/lib/db';

async function getAllAccounts() {
    const accounts = await prisma.account.findMany({
        orderBy: {
            username: 'asc'
        }
    });
    return accounts;
}

export { getAllAccounts };