"use server";

import { BEERED_BARCODE } from "../constants";
import { prisma } from "./db";

async function getAllItems() {
    const items = await prisma.item.findMany({
        where: {
            barcode: {
                not: BEERED_BARCODE
            }
        },
        orderBy: {
                name: 'asc'
            }
        }
    );
    return items;
}

export { getAllItems };