import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TransactionWithItem } from "./UserPage";
import { Card } from "@nextui-org/react";


export default function TotalDrinksByCount({ transactions }: { transactions: TransactionWithItem[]; }) {

    let transactionsByCount: { [key: string]: number; } = {};

    transactions.forEach(transaction => {
        if (!(transaction.item.type === 'DRYCK')) return;

        const name = transaction.item.name;

        if (!transactionsByCount[name]) {
            transactionsByCount[name] = 0;
        }

        transactionsByCount[name]++;
    });

    const data = React.useMemo(() => {
        return Object.keys(transactionsByCount).map(name => {
            return {
                drink: name,
                count: transactionsByCount[name],
            };
        });
    }, [transactionsByCount]);

    return (
        <Card className="p-4">

            <BarChart
                width={700}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="drink" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Streck per dryck" type="monotone" fill="#43AA8B" activeBar={<Rectangle fill="#EF3054" stroke="#000" />} />
            </BarChart>
        </Card>
    );
}
