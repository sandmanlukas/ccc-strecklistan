"use server";

import { prisma } from '@/app/lib/db';

async function deleteItem(id: number) {
    try {
        const dbItem = await prisma.item.delete({
            where: {
                id: id
            }
        });
        return dbItem;
    } catch (error) {
        console.log('error', error);
        return null;
    }

}

export { deleteItem };