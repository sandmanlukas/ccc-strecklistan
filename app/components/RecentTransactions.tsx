"use client";

import { TransactionWithItemAndUser } from "./StatsPage";
import { getAllTransactions } from "../lib/getAllTransactions";
import { Button, Link, Spinner } from "@nextui-org/react";
import { handleBeeredTransaction } from "./Transactions";
import { formatDate, formatTime } from "../lib/utils";
import { createTransaction } from "../lib/createTransaction";
import useTransactions from "../hooks/useTransactions";
import React from "react";
import { toast } from "react-toastify";


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

const TransactionsByDay = React.memo(function TransactionsByDay({ transactionsByDay, isValidating }: { transactionsByDay: { [key: string]: TransactionWithItemAndUser[] }, isValidating: boolean }) {
    if (!isValidating && transactionsByDay && Object.keys(transactionsByDay).length === 0) {
        return (
            <div className='text-center flex items-start text-gray-600 text-base'>
                <p>Inga transaktioner de senaste 3 veckorna. Skanna en öl eller något!</p>
            </div>
        )
    }

    return (
        transactionsByDay && Object.keys(transactionsByDay).length > 0 && (
            Object.keys(transactionsByDay).map((date) => (
                transactionsByDay[date].length > 0 && (
                    <div key={date}>
                        <h3 className="text-xl text-left font-semibold my-4">{date}</h3>
                        {transactionsByDay[date].map((transaction) => (
                            <Transaction key={transaction.id} transaction={transaction} date={date} />
                        ))}
                    </div>
                )
            ))
        )
    );
});

export default function RecentTransactions() {
    const threeWeeksAgo = new Date(Date.now() - 1000 * 3600 * 24 * 21);
    const { data, error, isValidating } = useTransactions(threeWeeksAgo);


    if (error) {
        console.log(error);
        toast.error('Något gick fel. Försök igen senare.');
    }

    return (
        <div className="mx-auto p-3 w-1/2">
            <h2 className="text-xl text-left font-semibold mb-2">Senaste transaktionerna</h2>
            <div className="flex flex-row justify-between">
                <p>Här visas de senaste tre veckornas transaktioner.</p>
                {isValidating ? <Spinner size="sm" /> : null}
            </div>
            <TransactionsByDay transactionsByDay={data as { [key: string]: TransactionWithItemAndUser[] }}  isValidating/>
        </div>
    );
}
