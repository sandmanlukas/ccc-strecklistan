import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TransactionWithItem } from "./UserPage";


export default function TotalDrinksByDay({ transactions }: { transactions: TransactionWithItem[]; }) {

    let transactionsByDay: { [key: string]: number; } = {
        'Måndag': 0,
        'Tisdag': 0,
        'Onsdag': 0,
        'Torsdag': 0,
        'Fredag': 0,
        'Lördag': 0,
        'Söndag': 0,
    };

    transactions.forEach(transaction => {
        const date = new Date(transaction.createdAt);
        let day = date.toLocaleString('sv-SE', { weekday: 'long' });
        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

        if (!transactionsByDay[day]) {
            transactionsByDay[day] = 0;
        }

        transactionsByDay[day]++;
    });

    const data = React.useMemo(() => {
        return Object.keys(transactionsByDay).map(day => {
            return {
                weekday: day,
                drinks: transactionsByDay[day],
            };
        });
    }, [transactionsByDay]);

    return (
        <div className="p-4">
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
                <XAxis dataKey="weekday" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="drinks" name="Streckade drycker" type="monotone" fill="#43AA8B" activeBar={<Rectangle fill="#EF3054" stroke="#000" />} />
            </BarChart>
        </div>
    );
}
