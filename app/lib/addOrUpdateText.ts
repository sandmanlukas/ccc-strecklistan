"use server";

import { prisma } from '@/app/lib/db';

interface Text {
    name: string;
    title: string;
    body: string;
}

async function addOrUpdateText(text: Text) {

    try {
        const textItem = await prisma.text.upsert({
            where: {name: text.name},
            update: {
                name: text.name,
                title: text.title,
                body: text.body,
            },
            create: {
                name: text.name,
                title: text.title,
                body: text.body,
            }
        });
        return textItem;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export { addOrUpdateText };