"use server";

import { prisma } from '@/app/lib/db';

async function getNonCCCUsersWithItemsAndTransactions() {

    try {

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                role: "KADAVER",
                            },
                            {
                                role: "OTHER",
                            },
                        ],
                    },
                    {
                        debt: {
                            gt: 0,
                        }
                    },
                ]
            },
            // Don't include beered
            include: {
                transactions: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    where: {
                        price: {
                            gt: 0,
                        },
                    },
                    include: {
                        item: true,
                    }
                }
            },
        });
        return users;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export { getNonCCCUsersWithItemsAndTransactions };