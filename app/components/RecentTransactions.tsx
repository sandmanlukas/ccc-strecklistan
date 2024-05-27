"use client";

import { useEffect, useState } from "react";
import { TransactionWithItemAndUser } from "./StatsPage";
import { getAllTransactions } from "../lib/getAllTransactions";
import { Link, Spinner } from "@nextui-org/react";
import { handleBeeredTransaction } from "./Transactions";
import { formatDate, formatTime } from "../lib/utils";

export default function RecentTransactions() {
    const [loading, setLoading] = useState(false);
    const [transactionsByDay, setTransactionsByDay] = useState<{ [key: string]: TransactionWithItemAndUser[] }>({});

    const groupTransactionsByDay = (transactions: TransactionWithItemAndUser[]) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const groupedTransactions: { [key: string]: TransactionWithItemAndUser[] } = {
            'Idag': [],
            'Igår': [],
            '1 vecka sedan': [],
            'Mer än 1 vecka sedan': [],
        };

        transactions.forEach((transaction) => {
            const date = new Date(transaction.createdAt);
            if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
                groupedTransactions['Idag'].push(transaction);
            } else if (date.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)) {
                groupedTransactions['Igår'].push(transaction);
            } else if (date.getTime() >= oneWeekAgo.getTime()) {
                groupedTransactions['1 vecka sedan'].push(transaction);
            } else {
                groupedTransactions['Mer än 1 vecka sedan'].push(transaction);
            }
        });
        console.log(groupedTransactions);

        setTransactionsByDay(groupedTransactions);
    }

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            const threeWeeksAgo = new Date(Date.now() - 1000 * 3600 * 24 * 21);
            const transactions = await getAllTransactions(true, threeWeeksAgo);
            groupTransactionsByDay(transactions);
            setLoading(false);
        }

        fetchTransactions();
    }, []);


    return (
        loading ?
            <div className='mx-auto mt-2'>
                <Spinner />
            </div>
            : (
                <div className="mx-auto p-3 w-1/2">
                    <h2 className="text-xl text-left font-semibold mb-2">Senaste transaktionerna</h2>
                    <p>Här visas de senaste tre veckornas transaktioner.</p>
                    {transactionsByDay && Object.keys(transactionsByDay).length > 0 ? (
                        Object.keys(transactionsByDay).map((date) => (
                            <div key={date}>
                                <h3 className="text-xl text-left font-semibold my-4">{date}</h3>
                                {transactionsByDay[date].map((transaction) => (
                                    <div key={transaction.id} className="bg-white shadow-md rounded-lg p-2 mb-2 border border-grey">
                                        <div className="flex justify-between items-center">
                                            <div className='flex items-baseline space-x-2'>
                                                <h3 className="text-lg font-medium">
                                                    {transaction.item.name}
                                                </h3>
                                                {transaction.item.volume > 0 && <p className='text-sm text-gray-600 ml-2'>{transaction.item.volume} cl</p>}
                                            </div>
                                            <p className="text-sm text-gray-600">{date == 'Idag' ? formatTime(transaction.createdAt) : formatDate(transaction.createdAt)}</p>
                                        </div>
                                        <div className="flex flex-row justify-between">
                                            {handleBeeredTransaction(transaction)}
                                            <h3 className="text-sm text-gray-600">
                                                <Link href={`/user/${transaction.userId}`} className="text-gray-600 hover:underline">
                                                    {transaction.user.username}
                                                </Link>
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className='text-center flex items-start text-gray-600 text-base'>
                            <p>Inga transaktioner än. Skanna en öl eller något!</p>
                        </div>
                    )
                    }
                </div>
            )
    );
}