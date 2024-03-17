"use server";

import { prisma } from '@/app/lib/db';
import { EditAccount } from '../components/AdminAccountCard';
const bcrypt = require("bcryptjs");


async function editAccount(account: EditAccount) {
    try {
        if (account.newPassword1 && account.newPassword2) {            
            const hashedPassword = await bcrypt.hash(
                account.newPassword1,
                10
            );
            account.password = hashedPassword;
        }

        const dbAccount = await prisma.account.update({
            where: {
                id: account.id
            },
            data: {
                username: account.username,
                role: account.role,
                password: account.password,
            }
        });
        return dbAccount;
    } catch (error) {
        console.log('error', error);
        return null;
    }

}

export { editAccount };