"use client";

import React from 'react';
import { TransactionWithItem } from '@/app/components/UserPage';
import { formatTransactionDate } from '../lib/utils';

interface TransactionProps {
    transactions: TransactionWithItem[];
}

// Helper function to format date
export const handleBeeredTransaction = (transaction: TransactionWithItem) => {
    
    if (transaction.beeredTransaction) {
        if (transaction.beeredBy) {
            return <p className="text-base text-slate-600">Bärsad av {transaction.beeredBy} för {transaction.price} kr</p>;
        } else if (transaction.beeredUser) {
            return <p className="text-base text-slate-600">Bärsade {transaction.beeredUser}</p>;
        }
    } else {
        return <p className="text-sm md:text-base text-slate-600">{transaction.price} kr</p>;
    }
}
const Transactions: React.FC<TransactionProps> = ({ transactions }) => {

    return (
        <div className="flex flex-col items-start mt-4">
            <h2 className="text-xl text-left font-semibold mb-2">Senaste transaktioner</h2>
            <div className="max-h-100 overflow-y-auto w-full">
                {transactions && transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className="bg-white shadow-md rounded-lg p-2 mb-2 border border-grey">
                            <div className="flex justify-between items-center">
                                <div className='flex items-baseline space-x-2'>
                                    <h3 className="text-sm md:text-lg font-small md:font-medium">
                                        {transaction.item.name}
                                    </h3>
                                    {transaction.item.volume > 0 && <p className='text-xs md:text-sm text-gray-600 ml-2'>{transaction.item.volume} cl</p>}
                                </div>
                                <p className="text-sm text-gray-600">{formatTransactionDate(transaction.createdAt)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                {
                                    handleBeeredTransaction(transaction)
                                }
                            </div>
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
