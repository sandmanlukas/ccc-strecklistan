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

        sendEmailsInBackground(requestData);

        return Response.json({ message: 'Email sending initiated' });
    } catch (error) {
        console.log('error', error);
        return Response.json({ error });
    }
}


async function sendEmailsInBackground(data: RequestData) {
    const { body, subject, lastEmailSent, swish, users } = data;
    const from = process.env.EMAIL_ADDRESS as string;

    const emails = users.map((user: UserWithItemsAndTransactions) => ({
        from,
        to: [user.email],
        subject,
        react: Email({ body, debt: user.debt, transactions: user.transactions, lastEmailSent, swish }) as React.ReactElement,
    }));

    const emailBatches = [];
    for (let i = 0; i < emails.length; i += 5) {
        emailBatches.push(emails.slice(i, i + 5));
    }

    for (const batch of emailBatches) {
        console.log('Sending batch of emails', batch);
        await resend.batch.send(batch);
    }
}
