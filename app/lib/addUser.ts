"use server";

import { prisma } from '@/app/lib/db';
import { ItemType, UserRole } from '@prisma/client';

export interface UserAdd {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
}

async function addUser(user: UserAdd) {
    
    try {

    const dbUser = await prisma.user.create({
            data: user
        });
        return dbUser;
    } catch (error) {
        console.log(error);
        return null;
    }

}

export { addUser };