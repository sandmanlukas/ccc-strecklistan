"use server";

import { prisma } from '@/app/lib/db';
import { ItemType } from '@prisma/client';

interface Item {
    barcode: string;
    name: string;
    price: number;
    type: ItemType;
    volume?: number;
}

async function addItem(item: Item) {
    
    try {

    const dbItem = await prisma.item.create({
            data: item
        });
        return dbItem;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export { addItem };