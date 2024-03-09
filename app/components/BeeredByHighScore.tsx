"use client";

import React from 'react';
import { TransactionWithItemAndUser } from './StatsPage';
import { Transaction } from '@prisma/client';

export default function BeeredByHighScore({ transactions }: { transactions: TransactionWithItemAndUser[] }) {

    let beeredByTransactionsByUser: { [key: string]: Transaction[] } = {};
    const beeredByTransactionsByUserCounts = [];
    
    const beeredTransactions = transactions.filter(transaction => (transaction.beeredTransaction && transaction.beeredBy));

    beeredTransactions.forEach(transaction => {
        const user = transaction.user.username;

        if (!beeredByTransactionsByUser[user]) {
            beeredByTransactionsByUser[user] = [];
        }

        beeredByTransactionsByUser[user].push(transaction);
    });

    for (const username in beeredByTransactionsByUser) {
        beeredByTransactionsByUserCounts.push({
            username,
            count: beeredByTransactionsByUser[username].length,
        });
    }

    beeredByTransactionsByUserCounts.sort((a, b) => b.count - a.count);
    
    return (
        <div className='ml-4'>
            <h3 className='text-2xl ml-2 mt-2 font-bold'>Bärsad flest gånger</h3>
            <div className='flex flex-col items-start mt-2'>
                {beeredByTransactionsByUserCounts.map((user, index) => (
                    <div key={user.username} className='flex items-center justify-between w-96 bg-white shadow-md rounded-lg p-2 mb-2 border border-grey'>
                        <h3 className='text-lg font-medium'>{index + 1}. {user.username} </h3>
                            <p className='text-base text-slate-600'>{user.count}</p>
                    </div>
                ))} 
            </div>
        </div>
    );
}

