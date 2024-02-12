"use server";

import { prisma } from "./db";

async function getAllItems() {
    const items = await prisma.item.findMany();
    return items;
}

export { getAllItems };