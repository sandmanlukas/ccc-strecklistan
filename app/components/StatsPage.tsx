"use client";

import { Item, Transaction, User } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../lib/getAllTransactions';
import { Card, Spinner, Tab, Tabs } from '@nextui-org/react';
import { getAllUsers } from '../lib/getAllUsers';
import DebtHighScore from './DebtHighScore';
import DivisionHighScore from './DivisionHighScore';
import TotalDrinksByDay from './TotalDrinksByDay';
import TotalDrinksByCount from './TotalDrinksByCount';
import DrinksByDay from './DrinksByDay';

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
                    <div className='mx-auto'>
                        <h2 className='text-3xl font-bold mt-4'>Statistik</h2>
                        <div className='grid grid-rows-2 gap-4 mx-auto'>
                            <div>
                                <Tabs aria-label="Different graphs">
                                    <Tab key="totalDrinksByDay" title="Streck per dag (totalt)">
                                        <TotalDrinksByDay transactions={transactions} />
                                    </Tab>
                                    <Tab key="totalDrinksByCount" title="Streck per dryck (totalt)">
                                        <TotalDrinksByCount transactions={transactions} />
                                    </Tab>
                                    <Tab key="drinksByDay" title="Streck per dag">
                                        <DrinksByDay transactions={transactions} />
                                    </Tab>
                                </Tabs>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <DebtHighScore users={users} />
                                </div>
                                <DivisionHighScore transactions={transactions} />
                            </div>
                        </div>
                    </div>
                </>
            )
    );
}
