"use server";

import {prisma} from '@/app/lib/db';

async function getItemByBarcode(barcode: string) {
    const item = await prisma.item.findUnique({
        where: {
            barcode: barcode,
        },
    });

    return item;
}

export { getItemByBarcode};