"use server";

import { prisma } from '@/app/lib/db';
import { Swish } from '@prisma/client';


async function editSwish(swish: Swish) {
    try {
        const dbswish = await prisma.swish.upsert({
            where: {
                id: swish.id
            },
            update: {
                name: swish.name,
                number: swish.number.replace(/\s+/g,''),
                imageUrl: swish.imageUrl
            },
            create: {
                name: swish.name,
                number: swish.number.replace(/\s+/g,''),
                imageUrl: swish.imageUrl
            }
        });

        return dbswish;
    } catch (error) {
        console.log('error', error);
        return null;
    }
}

export { editSwish };