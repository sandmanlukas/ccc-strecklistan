"use server";

import { prisma } from "./db";

async function getAllItems() {
    const items = await prisma.item.findMany(
        {
            orderBy: {
                name: 'asc'
            }
        }
    );
    return items;
}

export { getAllItems };