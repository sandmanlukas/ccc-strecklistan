"use client";

import { useState } from "react";
import { TransactionWithItemAndUser } from "./StatsPage";
import { Link, Spinner } from "@nextui-org/react";
import { handleBeeredTransaction } from "./Transactions";
import { formatDate, formatTime } from "../lib/utils";
import useTransactions from "../hooks/useTransactions";
import React from "react";


const Transaction = ({ transaction, date }: { transaction: TransactionWithItemAndUser, date: string }) => (
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
);

const TransactionsByDay = React.memo(({ transactionsByDay }: { transactionsByDay: { [key: string]: TransactionWithItemAndUser[] } }) => (
    transactionsByDay && Object.keys(transactionsByDay).length > 0 ? (
        Object.keys(transactionsByDay).map((date) => (
            <div key={date}>
                <h3 className="text-xl text-left font-semibold my-4">{date}</h3>
                {transactionsByDay[date].map((transaction) => (
                    <Transaction transaction={transaction} date={date} />
                ))}
            </div>
        ))
    ) : (
        <div className='text-center flex items-start text-gray-600 text-base'>
            <p>Inga transaktioner än. Skanna en öl eller något!</p>
        </div>
    )
));

export default function RecentTransactions() {
    const [loading, setLoading] = useState(false);
    // const [transactionsByDay, setTransactionsByDay] = useState<{ [key: string]: TransactionWithItemAndUser[] }>({});

    const threeWeeksAgo = new Date(Date.now() - 1000 * 3600 * 24 * 21);
    const { data, error, isLoading, isValidating } = useTransactions(threeWeeksAgo);

    const createFakeTransaction = async () => {
        // setLoading(true);
        const transaction = await createTransaction(93, undefined, '709caa8e-43e6-4a94-9889-987174f110b9');
        // setLoading(false);
    };
    return (
        loading ?
            <div className='mx-auto mt-2'>
                <Spinner />
            </div>
            : (
                <div className="mx-auto p-3 w-1/2">
                    <h2 className="text-xl text-left font-semibold mb-2">Senaste transaktionerna</h2>
                    <div className="flex flex-row justify-between">
                        <p>Här visas de senaste tre veckornas transaktioner.</p>
                        {isValidating ? <Spinner size="sm" /> : null}
                    </div>
                        <TransactionsByDay transactionsByDay={data as {[key:string]: TransactionWithItemAndUser[]}} />
                </div>
            )
    );
}
