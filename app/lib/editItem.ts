"use server";

import { prisma } from '@/app/lib/db';
import { Item } from '@prisma/client';



async function editItem(item: Item) {
    try {
        const dbItem = await prisma.item.update({
            where: {
                id: item.id
            },
            data: {
                name: item.name,
                price: item.price,
                type: item.type,
                volume: item.volume,
            }
        });
        return dbItem;
    } catch (error) {
        console.log('error', error);
        return null;
    }

}

export { editItem };