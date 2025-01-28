import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TransactionWithItem } from "./UserPage";
import { Card } from "@nextui-org/react";


export default function TotalDrinksByDay({ width, transactions }: { width: number, transactions: TransactionWithItem[]; }) {

    const transactionsByDay = React.useMemo(() => {
        const counts: { [key: string]: number } = { 'Måndag': 0, 'Tisdag': 0, 'Onsdag': 0, 'Torsdag': 0, 'Fredag': 0, 'Lördag': 0, 'Söndag': 0, };
        transactions.forEach(transaction => {
            const date = new Date(transaction.createdAt);
            let day = date.toLocaleString('sv-SE', { weekday: 'long' });
            day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

            if (!counts[day]) {
                counts[day] = 0;
            }

            counts[day]++;
        });

        return counts;
    }, [transactions]);

    const data = React.useMemo(() => {
        return Object.keys(transactionsByDay).map(day => {
            return {
                weekday: day,
                drinks: transactionsByDay[day],
            };
        });
    }, [transactionsByDay]);

    return (
        <>
            {data.length > 0 ?
                (
                    <Card className="p-4 overflow-x-auto">
                        <ResponsiveContainer width={width < 900 ? 800 : '100%'} height={300}>
                            <BarChart
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="weekday" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="drinks" name="Streckade drycker" type="monotone" fill="#43AA8B" activeBar={<Rectangle fill="#EF3054" stroke="#000" />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                ) : (
                    <Card className="p-4">
                        <h3 className="text-xl">Ingen data än. Strecka något.</h3>
                    </Card>
                )
            }
        </>
    );
}
