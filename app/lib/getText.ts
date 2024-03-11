"use server";

import { prisma } from '@/app/lib/db';

async function getText(name: string) {

    try {

        const text = await prisma.text.findUnique({
            where: {
                name
            }

        });
        return text;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export { getText };