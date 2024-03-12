import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TransactionWithItem } from "./UserPage";
import { Card } from "@nextui-org/react";


export default function TotalDrinksByCount({ transactions }: { transactions: TransactionWithItem[]; }) {

    const transactionsByCount = React.useMemo(() => {
        const counts: { [key: string]: number; } = {};

        transactions.forEach(({ item: { name } }) => {
            if (!counts[name]) {
                counts[name] = 0;
            }

            counts[name]++;
        });

        return counts;
    }, [transactions]);

    const data = React.useMemo(() => {
        return Object.keys(transactionsByCount).map(name => {
            return {
                drink: name,
                count: transactionsByCount[name],
            };
        });
    }, [transactionsByCount]);

    return (
        <>
            {
                data.length > 0 ? (
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
                ) : (
                    <Card className="p-4">
                        <h3 className="text-xl">Ingen data än. Strecka något.</h3>
                    </Card>
                )}
        </>
    );
}
