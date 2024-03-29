"use server";

import { Email } from "@/app/components/Email";
import { Resend } from 'resend';
import { UserWithItemsAndTransactions } from "@/app/components/AdminDebtCollect";
import { Swish } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RequestData {
    users: UserWithItemsAndTransactions[];
    lastEmailSent: Date | null;
    subject: string;
    body: string;
    swish: Swish;
}

export async function POST(req: Request) {
    try {
        const requestData: RequestData = await req.json();
        const body = requestData.body;
        const subject = requestData.subject;
        const lastEmailSent = requestData.lastEmailSent;
        const swish = requestData.swish;
        const from = process.env.EMAIL_ADDRESS as string;

        const emails = requestData.users.map((user: UserWithItemsAndTransactions) => {
            return {
                from: from,
                to: [user.email],
                subject: subject,
                react: Email({ body: body, debt: user.debt, transactions: user.transactions, lastEmailSent, swish}) as React.ReactElement,
            }
        });

        const data = await resend.batch.send(emails);

        return Response.json(data);
    } catch (error) {
        console.log('error', error);
        return Response.json({ error });
    }
}
