"use client";

import { Item, Transaction, User } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../lib/getAllTransactions';
import { Spinner } from '@nextui-org/react';
import { getAllUsers } from '../lib/getAllUsers';
import DebtHighScore from './DebtHighScore';
import DivisionHighScore from './DivisionHighScore';

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
                <div>
                    <h2 className='text-3xl font-bold ml-2 mt-2'>Statistik</h2>
                    <DebtHighScore users={users} />
                    <DivisionHighScore transactions={transactions} />
                </div>
            )
    );
}

