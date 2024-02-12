"use server";

import { prisma } from '@/app/lib/db';

async function getAllUsers() {
    const users = await prisma.user.findMany();
    return users;
}

export { getAllUsers };