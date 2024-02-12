"use server";

import { prisma } from '@/app/lib/db';

async function addItem(barcode: string, name: string, price: number) {
    const item = await prisma.item.create({
        data: {
            barcode: barcode,
            name: name,
            price: price,
        },
    });

    return item;
}

export { addItem };