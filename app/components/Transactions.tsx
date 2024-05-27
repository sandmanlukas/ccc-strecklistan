"use client";

import React from 'react';
import { TransactionWithItem } from '@/app/components/UserPage';
import { formatDate } from '../lib/utils';

interface TransactionProps {
    transactions: TransactionWithItem[];
    showUsername: boolean;
}

export const handleBeeredTransaction = (transaction: TransactionWithItem) => {
    if (transaction.beeredTransaction) {
        if (transaction.beeredBy) {
            return <p className="text-base text-slate-600">Bärsad av {transaction.beeredBy} för {transaction.price} kr</p>;
        } else if (transaction.beeredUser) {
            return <p className="text-base text-slate-600">Bärsade {transaction.beeredUser}</p>;
        }
    } else {
        if (transaction.price === 0) {
            return <p className="text-base text-slate-600">Gratis</p>;
        } else {
            return <p className="text-base text-slate-600">{transaction.price} kr</p>;
        }
    }
}


const Transactions: React.FC<TransactionProps> = ({ transactions, showUsername }) => {

    return (
        <div className="flex flex-col items-start mt-4">
            <h2 className="text-xl text-left font-semibold mb-2">Senaste transaktioner</h2>
            <div className="w-96 max-w-md max-h-100 overflow-y-auto">
                {transactions && transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="bg-white shadow-md rounded-lg p-2 mb-2 border border-grey">
                            <div className="flex justify-between items-center">
                                <div className='flex items-baseline space-x-2'>
                                    <h3 className="text-lg font-medium">
                                        {transaction.item.name}
                                    </h3>
                                    {transaction.item.volume > 0 && <p className='text-sm text-gray-600 ml-2'>{transaction.item.volume} cl</p>}
                                </div>
                                <p className="text-sm text-gray-600">{formatDate(transaction.createdAt)}</p>
                            </div>
                            {
                                handleBeeredTransaction(transaction)
                            }
                        </div>
                    ))
                ) : (
                    <div className='text-center flex items-start text-gray-600 text-base'>
                        <p>Inga transaktioner än. Skanna en öl eller något!</p>
                    </div>
                )
                }
            </div>
        </div>
    );
};

export default Transactions;
