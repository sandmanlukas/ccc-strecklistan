"use server";

import { prisma } from '@/app/lib/db';

async function getUser(id: number) {
    const users = await prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            transactions: {
                take: 10,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    item: true,
                },
            },
        },
    });
    return users;
}

export { getUser };