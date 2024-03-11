import * as React from 'react';
import { Html, Button } from "@react-email/components";
import { EmailTemplate } from './EmailTemplate';
import { TransactionWithItem } from './UserPage';

export interface EmailTemplateProps {
    body: string;
    debt: number;
    transactions: TransactionWithItem[];
    lastEmailSent: Date | null;
}

export const Email: React.FC<Readonly<EmailTemplateProps>> = ({
    body,
    debt,
    transactions,
    lastEmailSent
}) => (
    <Html lang='sv'>
       <EmailTemplate body={body} debt={debt} transactions={transactions} lastEmailSent={lastEmailSent}/>
    </Html>
);
