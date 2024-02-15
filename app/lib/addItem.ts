"use server";

import { prisma } from '@/app/lib/db';

async function addItem(barcode: string, name: string, price: number) {

    try {

    const item = await prisma.item.create({
            data: {
                barcode: barcode,
                name: name,
                price: price,
            },
        });
        return item;
    } catch (error) {
        return false;
    }

}

export { addItem };