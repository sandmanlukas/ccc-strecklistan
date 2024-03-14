"use server";

import { prisma } from '@/app/lib/db';
import { User } from '@prisma/client';

async function editUser(user: User) {
    try {
        const dbUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                debt: user.debt,
                avatar: user.avatar
            }
        });
        return dbUser;
    } catch (error) {
        console.log('error', error);

        return null;
    }
}

export { editUser };