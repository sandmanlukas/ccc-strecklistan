import React, { useEffect } from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { TransactionWithItem } from "./UserPage";
import { Card, Select, SelectItem } from "@nextui-org/react";
import { ItemType } from "@prisma/client";


interface DataPoint {
    date: string;
    count: number;
}
interface Data {
    [drink: string]: DataPoint[];
}

export default function DrinksByDay({ transactions }: { transactions: TransactionWithItem[]; }) {
    const [selectedDrink, setSelectedDrink] = React.useState<string>("Totalt");

    // Process the transactions data
    const dateToDrinkByDate: Data = transactions.reduce((acc: Data, transaction: TransactionWithItem) => {
        const date = new Date(transaction.createdAt).toLocaleDateString('sv-SE')
        const drink = transaction.item.name;

        if (!acc[drink]) {
            acc[drink] = [];
        }

        if (!acc['Totalt']) {
            acc['Totalt'] = [];
        }
        const existingDateIndex = acc[drink].findIndex(item => item.date === date);
        const existingTotalDateIndex = acc['Totalt'].findIndex(item => item.date === date);

        if (existingDateIndex === -1) {
            acc[drink].push({
                date,
                count: 1,
            });
        } else {
            acc[drink][existingDateIndex].count++;
        }

        if (existingTotalDateIndex === -1) {
            acc['Totalt'].push({
                date,
                count: 1,
            });
        } else {
            acc['Totalt'][existingTotalDateIndex].count++;
        }
        return acc;
    }, {});

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDrink(e.target.value);
    };

    const drinks = Object.keys(dateToDrinkByDate).sort();

    if (drinks.length === 0) {
        return <Card className="p-4">Inga drycker hittades</Card>;
    }
    
    return (
        <Card className="p-4">
            <Select
                aria-label="Choose drink to display in graph"
                className="my-2"
                selectedKeys={[selectedDrink]}
                onChange={handleSelectionChange}
            >
                {drinks.map(drink => (
                    <SelectItem key={drink} value={drink}>{drink}</SelectItem>
                ))}
            </Select>

            { selectedDrink ? (
                <div>
                    <h3 className="ml-2">
                        {selectedDrink}
                    </h3>
                    <LineChart
                    width={700}
                    height={300}
                    data={dateToDrinkByDate[selectedDrink]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5,}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 15 }} />
                        <YAxis
                            tickFormatter={(value) => Math.floor(value).toString()}
                            ticks={
                                dateToDrinkByDate[selectedDrink] ?
                                Array.from(new Set(dateToDrinkByDate[selectedDrink].map(item => Math.floor(item.count))))
                                : []
                            }
                            domain={[0, 'dataMax + 0.5']}
                            />
                        <Tooltip />
                        <Legend />
                        <Line key="melleruds" type="monotone" name="Antal streck" dataKey="count" stroke="#8884d8" activeDot={{ r: 6 }} />
                    </LineChart>
                </div>
                    ) : (
                        <h3 className="text-xl">Du måste välja en dryck.</h3>
                    )}
        </Card>
    );
}
