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
    const [width, setWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                <div className='space-y-4 w-screen md:w-auto mx-auto'>
                    <div className='mx-auto md:grid overflow-x-scroll w-full overflow-hidden'>
                        <h2 className='text-3xl font-bold mt-4 ml-2'>Statistik</h2>
                        <div className='mx-2 w-full md:w-auto'>
                            <Tabs aria-label="Different graphs" fullWidth>
                                <Tab key="totalDrinksByDay" title="Streck per dag (totalt)">
                                    <TotalDrinksByDay width={width} transactions={transactions} />
                                </Tab>
                                <Tab key="totalDrinksByCount" title="Streck per dryck (totalt)">
                                    <TotalDrinksByCount width={width} transactions={transactions} />
                                </Tab>
                                <Tab key="drinksByVolume" title="Volym per dryck (totalt)">
                                    <TotalDrinksByVolume width={width} transactions={transactions} />
                                </Tab>
                                <Tab key="drinksByDay" title="Streck per dag">
                                    <DrinksByDay width={width} transactions={transactions} />
                                </Tab>
                            </Tabs>
                        </div>

                        <div className='md:grid md:grid-cols-2 gap-4'>
                            <div className='col-span-2'>
                                <TotalDebt users={users} transactions={transactions} />
                            </div>
                            <DebtHighScore users={users} />
                            <DivisionHighScore transactions={transactions} />
                            <BeeredHighScore transactions={transactions} />
                            <BeeredByHighScore transactions={transactions} />
                        </div>
                    </div>
                </div>
            )
    );
}
