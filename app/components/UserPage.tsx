"use client";

import { getUser } from "@/app/lib/getUser";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, DropdownSection, Spinner } from "@nextui-org/react";
import { Item, Transaction, User } from "@prisma/client"
import { useEffect, useState } from "react"
import { handleScan } from "@/app/lib/utils";
import { createTransaction } from "@/app/lib/createTransaction";
import { toast } from "react-toastify";
import Transactions from "./Transactions";
import { getAllUsers } from "../lib/getAllUsers";
import { set } from "zod";


export interface TransactionWithItem extends Transaction {
    item: Item;
}

export default function UserPage({ id }: { id: number }) {
    const [user, setUser] = useState<User | null>(null);
    const [chosenUser, setChosenUser] = useState<User | null>(null);
    const [currentUsers, setCurrentUsers] = useState<User[]>([]);
    const [oldUsers, setOldUsers] = useState<User[]>([]);
    const [otherUsers, setOtherUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<TransactionWithItem[]>([]);
    const [barcode, setBarcode] = useState<string | null>(null);
    const [scanCount, setScanCount] = useState<number>(0);
    const [item, setItem] = useState<Item | null>(null);
    const [debt, setDebt] = useState<number>(0);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const user = await getUser(id);
            const users = await getAllUsers();
            if (!user || !users) {
                setLoading(false);
                return;
            }
            setUser(user);
            const currentUsers = users.filter(filterUser => filterUser.role !== 'KADAVER' && filterUser.role !== 'OTHER' && filterUser.username !== user.username);
            const oldUsers = users.filter(filterUser => filterUser.role === 'KADAVER' && filterUser.username !== user.username);
            const otherUsers = users.filter(filterUser => filterUser.role !== 'OTHER' && filterUser.username !== user.username);
            setCurrentUsers(currentUsers);
            setOldUsers(oldUsers);
            setOtherUsers(otherUsers);
            setTransactions(user.transactions);
            setDebt(user.debt);
            setLoading(false);
        }
        fetchUser();

    }, []);

    useEffect(() => {
        const handleScanEvent = handleScan(setBarcode, setScanCount);
        document.addEventListener('keydown', handleScanEvent);

        return () => {
            document.removeEventListener('keydown', handleScanEvent);
        }

    }, []);

    useEffect(() => {
        const performTransaction = async () => {
            if (barcode && user) {
                try {
                    const transaction = await createTransaction(user.id, barcode);
                    if (!transaction) {
                        return;
                    }

                    const item = transaction.item;
                    const newDebt = debt + item.price;
                    setTransactions(currentTransactions => {
                        // Add the new transaction to the end of the array
                        const updatedTransactions = [transaction, ...currentTransactions];
                        // Slice the array to keep only the last 10 items
                        return updatedTransactions.slice(0, 10);
                    });
                    setItem(item);

                    setDebt(newDebt);
                    toast.success(`1 ${item.name} tillagd!`);
                } catch (error) {
                    toast.error('Något gick fel! Är du säker på att den här varan finns?');
                }
            }
        }
        performTransaction();
    }, [scanCount, user])

    return (
        loading ?
            <div className='mx-auto mt-2'>
                <Spinner />
            </div>
            : (
                <div className="mx-auto p-3">
                    {user &&
                        <>
                            <div>
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
                                        <p className="text-sm">{user.firstName} {user.lastName}</p>
                                    </div>

                                    {(currentUsers || oldUsers || otherUsers) && (

                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    size="lg"
                                                    variant="bordered"
                                                >
                                                    Bärsa!
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu variant="faded" aria-label="Bärsa!">
                                                <DropdownSection title="Sittande" showDivider>
                                                    {currentUsers.map((filteredUser) => (
                                                        <DropdownItem key={filteredUser.id} onClick={() => setChosenUser(filteredUser)}>
                                                            {filteredUser.username}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownSection>
                                                <DropdownSection title="Kadaver" showDivider>
                                                    {oldUsers.map((filteredUser) => (
                                                        <DropdownItem key={filteredUser.id} onClick={() => setChosenUser(filteredUser)}>
                                                            {filteredUser.username}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownSection>
                                                <DropdownSection title="Andra" >
                                                    {otherUsers.map((filteredUser) => (
                                                        <DropdownItem key={filteredUser.id} onClick={() => setChosenUser(filteredUser)}>
                                                            {filteredUser.username}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownSection>
                                            </DropdownMenu>
                                        </Dropdown>

                                    )}
                                </div>
                            </div>
                            <div className="mt-3">
                                <p><span className="font-bold">Skuld:</span> {debt} kr</p>
                            </div>

                            <Transactions transactions={transactions} />
                        </>
                    }

                </div>
            )
    );
}

