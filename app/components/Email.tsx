import * as React from 'react';
import { Html, Button } from "@react-email/components";
import { EmailTemplate } from './EmailTemplate';
import { TransactionWithItem } from './UserPage';
import { Swish } from '@prisma/client';

export interface EmailTemplateProps {
    body: string;
    debt: number;
    transactions: TransactionWithItem[];
    lastEmailSent: Date | null;
    swish: Swish | null;
}

export const Email: React.FC<Readonly<EmailTemplateProps>> = ({
    body,
    debt,
    transactions,
    lastEmailSent,
    swish
}) => (
    <Html lang='sv'>
       <EmailTemplate body={body} debt={debt} transactions={transactions} lastEmailSent={lastEmailSent} swish={swish}/>
    </Html>
);
