"use client";

import { User } from '@prisma/client';
import React from 'react';
import { TransactionWithItemAndUser } from './StatsPage';
import { formatCentilitres } from '../lib/utils';

export default function TotalStats({ users, transactions }: { users: User[], transactions: TransactionWithItemAndUser[] }) {
    const totalDebt = users.reduce((acc, user) => acc + user.debt, 0);
    const totalVolume = transactions.reduce((acc, transaction) => acc + transaction.item.volume, 0);
    const numberOfDrinks = transactions.filter(transaction => transaction.item.type === 'DRYCK').length;


    if (!totalDebt && !totalVolume && !numberOfDrinks) (
        <div className='flex items-center justify-between w-96 bg-white shadow-md rounded-lg p-2 mb-2 border border-grey'>
            <h3 className='text-lg font-medium'>Ingen data än eller så har ingen en skuld. Strecka något.</h3>
        </div>
    )


    return (
        <div className='ml-4'>
            <h3 className='text-2xl ml-2 mt-2 font-bold'>Totalt</h3>
            {
                totalDebt || totalVolume || numberOfDrinks ? (
                    <div className='grid grid-cols-2 gap-4'>
                        {totalDebt > 0 && (
                            <div className='w-96 bg-white shadow-md rounded-lg p-2 border border-grey'>
                                <p className='text-lg font-medium'>Skuld: {totalDebt} kr</p>
                            </div>
                        )}
                        {totalVolume > 0 && (
                            <div className='w-96 bg-white shadow-md rounded-lg p-2 border border-grey'>
                                <p className='text-lg font-medium'>Volym: {formatCentilitres(totalVolume)}</p>
                            </div>
                        )}
                        {numberOfDrinks > 0 && (
                            <div className='w-96 bg-white shadow-md rounded-lg p-2 border border-grey'>
                                <p className='text-lg font-medium'>Antal streckade drycker: {numberOfDrinks} st</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className='flex items-center justify-between w-96 bg-white shadow-md rounded-lg p-2 mb-2 border border-grey'>
                        <h3 className='text-lg font-medium'>Ingen data än eller så har ingen en skuld. Strecka något.</h3>
                    </div>
                )

            }
        </div>
    );
}

