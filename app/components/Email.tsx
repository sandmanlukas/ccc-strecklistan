import * as React from 'react';
import { Html, Button } from "@react-email/components";
import { EmailTemplate } from './EmailTemplate';
import { TransactionWithItem } from './UserPage';

interface EmailTemplateProps {
    body: string;
    debt: number;
    transactions: TransactionWithItem[];
}

export const Email: React.FC<Readonly<EmailTemplateProps>> = ({
    body,
    debt,
    transactions,
}) => (
    <Html lang='sv'>
       <EmailTemplate body={body} debt={debt} transactions={transactions}/>
    </Html>
);
