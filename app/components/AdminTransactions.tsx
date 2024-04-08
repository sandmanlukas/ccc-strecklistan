"use client"

import React, { useEffect, useState } from "react";

import { TransactionWithItemAndUser } from "./StatsPage";
import { Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { formatTransactionDate } from "../lib/utils";
import { MdDeleteForever, MdClear } from "react-icons/md";


export function AdminTransactions({ transactions }: { transactions: TransactionWithItemAndUser[] }) {
    const [filteredUsers, setFilteredUsers] = useState<string[]>(['']);
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);

    const uniqueUsers = Array.from(new Set(transactions.map((transaction) => transaction.user.username)));

    useEffect(() => {
        if (filteredUsers.length > 1) {
            const filtered = transactions.filter(transaction => filteredUsers.includes(transaction.user.username));
            setFilteredTransactions(filtered);
        } else if (filteredUsers.length === 1 && filteredUsers[0] === '') {
            setFilteredTransactions(transactions);
        }
    }, [filteredUsers, transactions]);

    const columns = [
        {
            title: "Namn",
            key: "name",
        },
        {
            title: "Pris (kr)",
            key: "price",
        },
        {
            title: "Datum",
            key: "createdAt",
        },
        {
            title: "Användare",
            key: "user",
        },
        {
            title: "Åtgärder",
            key: "actions",
        },

    ]

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setFilteredUsers(e.target.value.split(","));
    };

    const clearSelection = () => {
        setFilteredUsers(['']);
    }

    const deleteTransaction = (transaction: TransactionWithItemAndUser) => {
        console.log("Deleting transaction", transaction);
    }

    return (
        <div className="flex justify-center w-auto">
            <div>
                <div className="flex items-center space-x-4">
                    <Select
                        label="Filtrera användare"
                        aria-label="Filtrera användare"
                        selectionMode="multiple"
                        placeholder="Välj användare"
                        selectedKeys={filteredUsers}
                        onChange={handleSelectionChange}
                        className="mb-2"
                    >
                        {uniqueUsers.map((user) => (
                            <SelectItem key={user} value={user}>
                                {user}
                            </SelectItem>
                        ))}
                    </Select>
                    <Tooltip content="Rensa filter">
                        <span className="text-lg cursor-pointer active:opacity-50">
                            <MdClear onClick={clearSelection} />
                        </span>
                    </Tooltip>
                </div>
                <Table
                    aria-label="Transaktioner"
                    layout="fixed"
                    isHeaderSticky
                    classNames={{
                        base: "max-h-[520px] overflow-scroll",
                    }}
                >
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.title}</TableColumn>}
                    </TableHeader>
                    <TableBody items={filteredTransactions}>
                        {(transaction: TransactionWithItemAndUser) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.item.name}</TableCell>
                                <TableCell>{transaction.price} kr</TableCell>
                                <TableCell>{formatTransactionDate(transaction.createdAt)}</TableCell>
                                <TableCell>{transaction.user.username}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center items-center">
                                        <Tooltip color="danger" content="Ta bort transaktion">
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                                <MdDeleteForever onClick={() => deleteTransaction(transaction)} />
                                            </span>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}