"use client";

import React from 'react';
import { TransactionWithItemAndUser } from './StatsPage';
import { Transaction } from '@prisma/client';

export interface BeeredTransactionCounts {
    username: string;
    count: number;
}

export default function BeeredHighScore({ transactions }: { transactions: TransactionWithItemAndUser[] }) {

    let beeredTransactionsByUser: { [key: string]: Transaction[] } = {};
    const beeredTransactionsByUserCounts: BeeredTransactionCounts[] = [];

    const beeredTransactions = transactions.filter(transaction => (transaction.beeredTransaction && transaction.beeredUser));

    beeredTransactions.forEach(transaction => {
        const user = transaction.user.username;

        if (!beeredTransactionsByUser[user]) {
            beeredTransactionsByUser[user] = [];
        }

        beeredTransactionsByUser[user].push(transaction);
    });

    for (const username in beeredTransactionsByUser) {
        beeredTransactionsByUserCounts.push({
            username,
            count: beeredTransactionsByUser[username].length,
        });
    }

    beeredTransactionsByUserCounts.sort((a, b) => b.count - a.count);

    return (
        <div className='ml-4'>
            <h3 className='text-2xl ml-2 mt-2 font-bold'>Flest bärsningar</h3>
            <div className='flex flex-col items-start mt-2'>
                {beeredTransactionsByUserCounts.length > 0 ? (
                    beeredTransactionsByUserCounts.map((user, index) => (
                        <div key={user.username} className='w-full flex items-center justify-between bg-white shadow-md rounded-lg p-2 mb-2 border border-grey'>
                            <h3 className='text-lg font-medium'>{index + 1}. {user.username} </h3>
                            <p className='text-base text-slate-600'>{user.count}</p>
                        </div>
                    ))
                ) : (
                    <div className='w-full flex items-center justify-between bg-white shadow-md rounded-lg p-2 mb-2 border border-grey'>
                        <h3 className='text-lg font-medium'>Ingen data än. Strecka något.</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

