"use client";

import { Item, Transaction, User } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '@/app/lib/getAllTransactions';
import { Spinner, Tab, Tabs } from '@nextui-org/react';
import { getAllUsers } from '@/app/lib/getAllUsers';
import DebtHighScore from '@/app/components/DebtHighScore';
import DivisionHighScore from '@/app/components/DivisionHighScore';
import TotalDrinksByDay from '@/app/components/TotalDrinksByDay';
import TotalDrinksByCount from '@/app/components/TotalDrinksByCount';
import DrinksByDay from '@/app/components/DrinksByDay';
import BeeredHighScore from '@/app/components/BeeredHighScore';
import BeeredByHighScore from '@/app/components/BeeredByHighScore';
import TotalDebt from '@/app/components/TotalStats';
import TotalDrinksByVolume from '@/app/components/TotalDrinksByVolume';

export interface TransactionWithItemAndUser extends Transaction {
    item: Item;
    user: User;
}

export default function StatsPage() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<TransactionWithItemAndUser[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            const transactions = await getAllTransactions();
            const users = await getAllUsers();

            if (!transactions || !users) {
                setLoading(false);
                return;
            }
            setUsers(users);
            setTransactions(transactions);
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
                <>
                    <div className='mx-auto space-y-4'>
                        <h2 className='text-3xl font-bold mt-4'>Statistik</h2>
                        <div className='grid'>
                            <div>
                                <Tabs aria-label="Different graphs">
                                    <Tab key="totalDrinksByDay" title="Streck per dag (totalt)">
                                        <TotalDrinksByDay transactions={transactions} />
                                    </Tab>
                                    <Tab key="totalDrinksByCount" title="Streck per dryck (totalt)">
                                        <TotalDrinksByCount transactions={transactions} />
                                    </Tab>
                                    <Tab key="drinksByVolume" title="Volym per dryck (totalt)">
                                        <TotalDrinksByVolume transactions={transactions} />
                                    </Tab>
                                    <Tab key="drinksByDay" title="Streck per dag">
                                        <DrinksByDay transactions={transactions} />
                                    </Tab>
                                </Tabs>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='col-span-2'>
                                    <TotalDebt users={users} transactions={transactions} />
                                </div>
                                <div>
                                    <DebtHighScore users={users} />
                                </div>
                                <DivisionHighScore transactions={transactions} />
                                <BeeredHighScore transactions={transactions} />
                                <BeeredByHighScore transactions={transactions} />
                            </div>
                        </div>
                    </div>
                </>
            )
    );
}
