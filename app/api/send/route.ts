"use server";

import { Email } from "@/app/components/Email";
import { Resend } from 'resend';
import { TransactionWithItem } from "@/app/components/UserPage";
import { User } from "@prisma/client";
import { UserWithItemsAndTransactions } from "@/app/components/AdminDebtCollect";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RequestData {
    users: UserWithItemsAndTransactions[];
    subject: string;
    body: string;
}

export async function POST(req: Request) {
    try {
        const requestData: RequestData = await req.json();
        const body = requestData.body;
        const subject = requestData.subject;
        const from = process.env.EMAIL_FROM as string;

        const emails = requestData.users.map((user: UserWithItemsAndTransactions) => {
            return {
                from: from,
                to: [user.email],
                subject: subject,
                react: Email({ body: body, debt: user.debt, transactions: user.transactions }) as React.ReactElement,
            }
        });

        const data = await resend.batch.send(emails);

        return Response.json(data);
    } catch (error) {
        return Response.json({ error });
    }
}
