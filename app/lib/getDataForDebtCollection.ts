"use server";

import { prisma } from '@/app/lib/db';

async function getDataForDebtCollection() {

    try {
        const lastEmailSent = await prisma.debtCollect.findFirst();

        // Get start and end date for the last email sent
        let endDate = new Date();
        // Set start date to a long time ago at start
        let startDate = new Date(2000, 1, 1);
        if (lastEmailSent && lastEmailSent.emailSentAt) {
            startDate = lastEmailSent.emailSentAt;
        }

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
                        AND: [
                            {
                                createdAt: {
                                    gte: startDate,
                                },
                            },
                            {
                                createdAt: {
                                    lte: endDate,
                                },
                            },
                            {
                                price: {
                                    gt: 0,
                                },
                            },
                        ]
                    },
                    include: {
                        item: true,
                    }
                }
            },
        });

        return { users, lastEmailSent: lastEmailSent?.emailSentAt };
    } catch (error) {
        console.log('error', error);
        return {users: null, lastEmailSent: null};
    }
}

async function updateLastEmailSent() {
    try {
        const lastEmailSent = await prisma.debtCollect.findFirst();
        if (lastEmailSent) {
            await prisma.debtCollect.update({
                where: {
                    id: lastEmailSent.id,
                },
                data: {
                    emailSentAt: new Date(),
                }
            });
        } else {
            await prisma.debtCollect.create({
                data: {
                    emailSentAt: new Date(),
                }
            });
        }

        return lastEmailSent
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export { getDataForDebtCollection, updateLastEmailSent };