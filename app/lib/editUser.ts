"use server";

import { prisma } from '@/app/lib/db';
import { User } from '@prisma/client';
import { roleStringToUserRole } from './utils';

async function editUser(user: User, oldUser: User) {
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
                role: roleStringToUserRole[user.role],
                debt: user.debt,
                avatar: user.avatar
            }
        });

        if (oldUser.username !== user.username) {
            await prisma.transaction.updateMany({
                where: {
                    beeredBy: oldUser.username
                },
                data: {
                    beeredBy: dbUser.username
                }
            });

            await prisma.transaction.updateMany({
                where: {
                    beeredUser: oldUser.username
                },
                data: {
                    beeredUser: dbUser.username
                }
            });
        }

            return dbUser;
    } catch (error) {
        console.log('error', error);

        return null;
    }
}

export { editUser };