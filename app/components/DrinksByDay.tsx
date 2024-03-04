import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TransactionWithItem } from "./UserPage";


export default function DrinksByDay({ transactions }: { transactions: TransactionWithItem[]; }) {
    // function getRandomInt(min: number, max: number) {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

    // transactions = [];

    // for (let i = 0; i < 100; i++) {
    //     let date = new Date();
    //     date.setDate(date.getDate() - i); // subtract i days from the current date

    //     transactions.push({
    //         id: i,
    //         createdAt: date, // format the date as 'yyyy-mm-dd'
    //         updatedAt: date,
    //         userId: getRandomInt(1, 10),
    //         barcode: '1234567890123',
    //         price: 10,
    //         beeredTransaction: false,
    //         beeredBy: null,
    //         beeredUser: null,
    //         item: {
    //             id: 1,
    //             name: 'Coca Cola',
    //             type: 'DRYCK',
    //             price: 10,
    //             barcode: '1234567890123',
    //             createdAt: date,
    //             updatedAt: date,
    //             volume: 33,
    //         }
    //     });
    // }

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
        <>
            <h2>Dryck per dag</h2>
            <ResponsiveContainer width={700} height={500}>
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
                    <Legend  />
                    <Bar dataKey="drinks" name="Streckade drycker" type="monotone" fill="#43AA8B" activeBar={<Rectangle fill="#EF3054" stroke="#000" />} />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
