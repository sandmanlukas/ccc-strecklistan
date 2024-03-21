"use server";

import { prisma } from '@/app/lib/db';

async function deleteItem(id: number, barcode: string) {
    try {
        const deleteTransactions = prisma.transaction.deleteMany({
            where: {
                barcode: barcode
            }
        });

        const deleteItem = prisma.item.delete({
            where: {
                id: id
            }
        });

        const [_, dbItem] = await prisma.$transaction([deleteTransactions, deleteItem]);
        return dbItem;
    } catch (error) {
        console.log('error', error);
        return null;
    }

}

export { deleteItem };