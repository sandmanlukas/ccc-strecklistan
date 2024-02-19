"use server";

import { prisma } from '@/app/lib/db';

async function deleteUser(id: number) {
    try {
        const dbUser = await prisma.user.delete({
            where: {
                id: id
            }
        });
        return dbUser;
    } catch (error) {
        console.log('error', error);
        return null;
    }

}

export { deleteUser };