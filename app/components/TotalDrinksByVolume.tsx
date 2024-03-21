import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TransactionWithItem } from "./UserPage";
import { Card } from "@nextui-org/react";
import { BEERED_BARCODE } from "../constants";


export default function TotalDrinksByVolume({ transactions }: { transactions: TransactionWithItem[]; }) {

    transactions = transactions.filter(({ item }) => item.barcode !== BEERED_BARCODE);

    const transactionsByVolyme = React.useMemo(() => {
        const volumes: { [key: string]: number; } = {};

        transactions.forEach(({ item: { name, volume } }) => {
            if (!volumes[name]) {
                volumes[name] = 0;
            }

            volumes[name] += volume;
        });

        return volumes;
    }, [transactions]);

    const data = React.useMemo(() => {
        return Object.keys(transactionsByVolyme).map(name => {
            return {
                drink: name,
                volume: (transactionsByVolyme[name] / 100).toFixed(2),
            };
        });
    }, [transactionsByVolyme]);

    console.log(data);
    
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
                            <Bar dataKey="volume" name="Volym per dryck (liter)" type="monotone" fill="#43AA8B" activeBar={<Rectangle fill="#EF3054" stroke="#000" />} />
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
