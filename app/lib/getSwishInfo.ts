"use server";

import { prisma } from '@/app/lib/db';

async function getSwishInfo() {
    try {
        const swish = await prisma.swish.findFirst();
        return swish;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export { getSwishInfo };