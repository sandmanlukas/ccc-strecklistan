"use client";

import React from 'react';
import { TransactionWithItemAndUser } from './StatsPage';
import { ItemType, Transaction } from '@prisma/client';
import { userRoleToDivision, personsPerDivision } from '../lib/utils';
import { BEERED_BARCODE } from '@/app/constants';

interface DivisionTransactionCounts {
    division: string;
    count: number;
    countPerPerson: number;
}

export default function DebtHighScore({ transactions }: { transactions: TransactionWithItemAndUser[] }) {

    let divisionTransactions: { [key: string]: Transaction[] } = {};
    const divisionTransactionCounts: DivisionTransactionCounts[] = [];
    const drinkTransactions = transactions.filter(transaction => (transaction.item.type === 'DRYCK' as ItemType && transaction.item.barcode != BEERED_BARCODE));

    drinkTransactions.forEach(transaction => {
        const division = userRoleToDivision[transaction.user.role];

        if (!division) {
            return;
        }

        if (!divisionTransactions[division]) {
            divisionTransactions[division] = [];
        }

        divisionTransactions[division].push(transaction);
    });

    for (const division in divisionTransactions) {
        divisionTransactionCounts.push({
            division,
            count: divisionTransactions[division].length,
            countPerPerson: parseFloat((divisionTransactions[division].length / personsPerDivision[division]).toFixed(2)),
        });
    }

    divisionTransactionCounts.sort((a, b) => b.countPerPerson - a.countPerPerson);

    return (
        <div className='ml-4'>
            <h3 className='text-2xl ml-2 mt-2 font-bold'>Antal öl per styre</h3>
            <div className='flex flex-col items-start mt-2'>
                {divisionTransactionCounts.length > 0 ?
                    (
                        divisionTransactionCounts.map((division, index) => (
                            <div key={division.division} className='w-full flex items-center justify-between bg-white shadow-md rounded-lg p-2 mb-2 border border-grey'>
                                <h3 className='text-lg font-medium'>{index + 1}. {division.division} </h3>
                                <p className='text-base text-slate-600'>{division.countPerPerson} per/person ({division.count} totalt)</p>
                            </div>
                        ))
                    ) : (
                        <div className='w-full flex items-center justify-between bg-white shadow-md rounded-lg p-2 mb-2 border border-grey'>
                            <h3 className='text-lg font-medium'>Ingen data än. Strecka något.</h3>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

