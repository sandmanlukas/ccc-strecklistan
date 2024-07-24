"use client"

import React, { useEffect, useState } from "react";

import { TransactionWithItemAndUser } from "./StatsPage";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Tooltip, useDisclosure } from "@nextui-org/react";
import { MdClear } from "react-icons/md";
import { TransactionTable } from "./TransactionTable";
import { deleteTransaction } from "../lib/deleteTransaction";
import { toast } from "react-toastify";


export function AdminTransactions({ transactions }: { transactions: TransactionWithItemAndUser[] }) {
    const { isOpen: isOpenDeleteModal, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal, onOpenChange: onOpenChangeDeleteModal } = useDisclosure();
    const { isOpen: isOpenInformationModal, onOpen: onOpenInformationModal, onClose: onCloseInformationModal, onOpenChange: onOpenChangeInformationModal } = useDisclosure();
    const [filteredUsers, setFilteredUsers] = useState<string[]>(['']);
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [updatedTransactions, setUpdatedTransactions] = useState(transactions);
    const [selectedTransactionDeletion, setSelectedTransactionDeletion] = useState<TransactionWithItemAndUser | null>(null);
    const [selectedTransactionInformation, setSelectedTransactionInformation] = useState<TransactionWithItemAndUser | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const uniqueUsers = Array.from(new Set(transactions.map((transaction) => transaction.user.username)));

    useEffect(() => {                
        if (filteredUsers.length >= 1 && filteredUsers[0] !== '') {
            const filtered = updatedTransactions.filter(transaction => filteredUsers.includes(transaction.user.username));            
            setFilteredTransactions(filtered);
        } else if (filteredUsers.length === 1 && filteredUsers[0] === '') {
            setFilteredTransactions(updatedTransactions);
        }
    }, [filteredUsers, updatedTransactions]);

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
            title: "Bärsning",
            key: "beered",
        },
        {
            title: "Åtgärder",
            key: "actions",
        },

    ]

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let filteredUsers = e.target.value.split(",");

        // First element of e.target.value is a comma, therefore we remove the first element after splitting
        if (filteredUsers[0] === '') {
            filteredUsers.shift();
            }
            
        setFilteredUsers(filteredUsers);
    };

    const clearSelection = () => {
        setFilteredUsers(['']);
    }

    const selectTransactionForDeletions = (transaction: TransactionWithItemAndUser) => {
        if (transaction) {
            setSelectedTransactionDeletion(transaction);
            onOpenDeleteModal();
        }
    }

    const selectTransactionForInformation = (transaction: TransactionWithItemAndUser) => {
        if (transaction) {
            setSelectedTransactionInformation(transaction);
            onOpenInformationModal();
        }
    }

    const handleDeleteTransaction = async () => {
        if (selectedTransactionDeletion) {
            setIsDeleting(true);

            const deletedTransaction = await deleteTransaction(selectedTransactionDeletion);

            if (!deletedTransaction) {
                toast.error('Något gick fel vid borttagning av transaktion!');
                closeDeleteModal();
                return;

            }

            const updatedTransactions = filteredTransactions.filter(transaction => transaction.id !== selectedTransactionDeletion.id);
            setUpdatedTransactions(updatedTransactions);
            closeDeleteModal();
            toast.success('Transaktion borttagen!');
        }
    }

    const closeDeleteModal = () => {
        if (selectedTransactionDeletion) {
            setSelectedTransactionDeletion(null);
        }
        setIsDeleting(false);
        onCloseDeleteModal();
    }

    const closeInformationModal = () => {
        if (selectedTransactionInformation) {
            setSelectedTransactionInformation(null);
        }
        onCloseInformationModal();
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
                <TransactionTable 
                    transactions={filteredTransactions} 
                    columns={columns} 
                    label="Transaktioner" 
                    selectTransactionDeletion={selectTransactionForDeletions}
                    selectTransactionInformation={selectTransactionForInformation}
                    />
                {selectedTransactionDeletion && (
                    <Modal
                        isOpen={isOpenDeleteModal}
                        onClose={closeDeleteModal}
                        onOpenChange={onOpenChangeDeleteModal}
                        placement="top-center"
                        size="3xl"
                    >
                        <ModalContent>
                            {() => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 p-4 text-lg font-bold">Ta bort transaktion</ModalHeader>
                                    <ModalBody className="p-4">
                                        <p>Är du säker på att du vill ta bort denna transaktion? Priset för transaktionen kommer dras bort från personens skuld.</p>
                                        <TransactionTable transactions={[selectedTransactionDeletion]} columns={columns.slice(0,-1)} label="Transaktion(er) att ta bort"/>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="flat" onPress={closeDeleteModal}>
                                            Stäng
                                        </Button>
                                        <Button
                                            color="danger"
                                            onPress={handleDeleteTransaction}
                                            isLoading={isDeleting}>
                                            Ta bort transaktion
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                )}
                {selectedTransactionInformation && (
                    <Modal
                        isOpen={isOpenInformationModal}
                        onClose={closeInformationModal}
                        onOpenChange={onOpenChangeInformationModal}
                        placement="top-center"
                        size="3xl"
                    >
                        <ModalContent>
                            {() => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1 p-4 text-lg font-bold">Information</ModalHeader>
                                    <ModalBody className="p-4">
                                        <p>Här är information om denna transaktion.</p>
                                        <TransactionTable transactions={[selectedTransactionInformation]} columns={columns.slice(0,-1)} label="Information"/>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="flat" onPress={closeInformationModal}>
                                            Stäng
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