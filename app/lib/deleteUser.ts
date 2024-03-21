"use server";

import { prisma } from '@/app/lib/db';

async function deleteUser(id: number) {
    try {
        const deleteTransactions = prisma.transaction.deleteMany({
            where: {
                userId: id
            }
        });

        const deleteUser = prisma.user.delete({
            where: {
                id: id
            }
        });

        const [_, dbUser] = await prisma.$transaction([deleteTransactions, deleteUser]);
        return dbUser;
    } catch (error) {
        console.log('error', error);
        return null;
    }

}

export { deleteUser };