import * as React from 'react';
import { Container, Head, Heading, Tailwind, Text } from "@react-email/components";
import { TransactionWithItem } from './UserPage';
import { formatDateAndTime } from '../lib/utils';


interface EmailTemplateProps {
    body: string;
    debt: number;
    transactions: TransactionWithItem[];
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    body,
    debt,
    transactions,
}) => (

    <Tailwind>
        <Head />
        <Container style={container}>
            <Heading style={header}>CCC - Strecklistan</Heading>
            <Text style={text}>
                {body}
            </Text>
            <Text style={text}>
                Din nuvarande skuld ligger på: <span className='font-bold'>{debt} kr.</span>
            </Text>
            <Text style={text}>
                Dina transaktioner (sedan senaste skuldutskicket):
                <table className='table-auto'>
                    <thead>
                        <tr>
                            <th className='text-left pr-2'>Vad?</th>
                            <th className='text-left pr-2'>Hur mycket?</th>
                            <th className='text-left pr-2'>När?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td className='pr-2'>{transaction.item.name}</td>
                                <td className='pr-2'>{transaction.price} kr</td>
                                <td className='pr-2'>{formatDateAndTime(transaction.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Text>
            <Text style={{
                ...footer,
                marginBottom: "0",
            }}>
                Med vänliga hälsningar,
            </Text>
            <Text style={{
                ...footer,
                fontWeight: "bold",
                marginTop: "0",
            }}>
                CCC & Ölchefen
            </Text>
        </Container>
    </Tailwind >
);

const table = {
    borderCollapse: "collapse",
    width: "100%",
    textAlign: "left",
    marginTop: "24px",
};

const container = {
    paddingLeft: "12px",
    paddingRight: "12px",
    margin: "0 auto",
};

const header = {
    color: "black",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "1rem",
    borderTop: "0.5rem solid #2c5282",
    borderBottom: "0.5rem solid #2c5282",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "#fde68a",
}

const h1 = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "40px 0",
    padding: "0",
};

const text = {
    color: "#333",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    margin: "24px 0",
};

const footer = {
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "12px",
    lineHeight: "22px",
    marginTop: "12px",
    marginBottom: "24px",
};

