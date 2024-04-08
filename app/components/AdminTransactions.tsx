"use client"

import React, { useEffect, useState } from "react";

import { TransactionWithItemAndUser } from "./StatsPage";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react";
import { formatTransactionDate } from "../lib/utils";
import { MdDeleteForever, MdClear } from "react-icons/md";
import { TransactionTable } from "./TransactionTable";


export function AdminTransactions({ transactions }: { transactions: TransactionWithItemAndUser[] }) {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [filteredUsers, setFilteredUsers] = useState<string[]>(['']);
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithItemAndUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
        setFilteredUsers(e.target.value.split(","));
    };

    const clearSelection = () => {
        setFilteredUsers(['']);
    }

    const selectTransactionForDeletions = (transaction: TransactionWithItemAndUser) => {
        if (transaction) {
            setSelectedTransaction(transaction);
            onOpen();
        }
    }

    const deleteTransaction = () => {
        if (selectedTransaction) {
            setIsDeleting(true);
            console.log("Deleting transaction", selectedTransaction);
            setIsDeleting(false);
            onClose();
        }
    }

    const closeModal = () => {
        if (selectedTransaction) {
            setSelectedTransaction(null);
        }
        onClose();
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
                <TransactionTable transactions={filteredTransactions} columns={columns} label="Transaktioner" selectTransaction={selectTransactionForDeletions}/>
                {selectedTransaction && (
                    <Modal
                        isOpen={isOpen}
                        onClose={closeModal}
                        onOpenChange={onOpenChange}
                        placement="top-center"
                    >
                        <ModalContent>
                            {() => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 p-4 text-lg font-bold">Ta bort transaktion</ModalHeader>
                                    <ModalBody className="p-4">
                                        <p>Är du säker på att du vill ta bort denna transaktion? Priset för transaktionen kommer dras bort från personens skuld.</p>
                                        <TransactionTable transactions={[selectedTransaction]} columns={columns.slice(0,-1)} label="Transaktion(er) att ta bort"/>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="flat" onPress={closeModal}>
                                            Stäng
                                        </Button>
                                        <Button
                                            color="danger"
                                            onPress={deleteTransaction}
                                            isLoading={isDeleting}>
                                            Ta bort transaktion
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                )}
            </div>
        </div>
    );
}