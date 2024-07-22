"use client";

import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import { Item, Transaction, User } from "@prisma/client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, DropdownSection, Spinner, Card, CardBody, dropdown, button, Avatar } from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import { getUser } from "@/app/lib/getUser";
import { handleScan, positionLabels } from "@/app/lib/utils";
import { getAllUsers } from "@/app/lib/getAllUsers";
import { createTransaction } from "@/app/lib/createTransaction";
import Transactions from "@/app/components/Transactions";
import { DEFAULT_AVATAR_URL } from "../constants";
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


export interface TransactionWithItem extends Transaction {
    item: Item;
}

export interface FavoriteDrinkCount {
    drink: string;
    count: number;
}

function calculateFavoriteDrink(transactions: TransactionWithItem[]): FavoriteDrinkCount {
    const drinkCounts: Record<string, number> = {};

    transactions.forEach((transaction) => {
        if (transaction.item.type != 'DRYCK') {
            return;
        }

        const { name } = transaction.item;

        if (drinkCounts[name]) {
            drinkCounts[name] += 1;
        } else {
            drinkCounts[name] = 1;
        }
    });

    let favoriteDrink = '';
    let maxCount = 0;

    Object.entries(drinkCounts).forEach(([drink, count]) => {
        if (count > maxCount) {
            favoriteDrink = drink;
            maxCount = count;
        }
    });

    return { drink: favoriteDrink, count: maxCount };
}

const CreateNewItemToast = ({ router, barcode }: { router: AppRouterInstance, barcode: string }) => (
    <div className="flex items-center justify-center">
        <div>
            <div className="flex items-start">
                <div>
                    <h3 className="text-sm font-medium">Något gick fel! Den här varan finns inte.</h3>
                    <div className="text-sm mt-2">
                        <button className="w-full mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { toast.dismiss(); router.push(`/item/new?barcode=${barcode}`) }}>Skapa ny produkt!</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function UserPage({ id }: { id: number }) {
    const [user, setUser] = useState<User | null>(null);
    const [beeredUser, setBeeredUser] = useState<User | null>(null);
    const [currentUsers, setCurrentUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<TransactionWithItem[]>([]);
    const [barcode, setBarcode] = useState<string | null>(null);
    const [scanCount, setScanCount] = useState<number>(0);
    const [item, setItem] = useState<Item | null>(null);
    const [debt, setDebt] = useState<number>(0);
    const [favoriteDrink, setFavoriteDrink] = useState<FavoriteDrinkCount | null>(null);
    const router = useRouter();

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const rolesOrder = ['ORDFORANDE', 'KASSOR', 'BYGGCHEF', 'BILCHEF', 'GARDVAR', 'KLADCHEF', 'PROGRAMCHEF', 'ANNONSCHEF', 'MUSIKCHEF', 'OLCHEF', 'PRCHEF', 'KADAVER', 'OTHER'];
        const fetchUser = async () => {
            setLoading(true);
            const user = await getUser(id);
            const users = await getAllUsers();
            if (!user || !users) {
                setLoading(false);
                return;
            }
            users.sort((a, b) => {
                return rolesOrder.indexOf(a.role) - rolesOrder.indexOf(b.role);
            });
            setUser(user);
            const currentUsers = users.filter(filterUser => filterUser.role !== 'KADAVER' && filterUser.role !== 'OTHER' && filterUser.username !== user.username);
            setCurrentUsers(currentUsers);
            setTransactions(user.transactions);
            setFavoriteDrink(calculateFavoriteDrink(user.transactions));
            setDebt(user.debt);
            setLoading(false);
        }
        fetchUser();

    }, [id]);

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
                    const { transaction, freeBeer } = await createTransaction(user.id, beeredUser?.id, barcode);
                    if (!transaction) {
                        return;
                    }

                    const item = transaction.item;
                    const price = beeredUser ? 0 : item.price;

                    if (beeredUser) {
                        toast.success(`Du bärsade ${beeredUser.username} med 1 ${transaction.item.name}!`);
                    } else {
                        toast.success(`1 ${item.name} tillagd!`);
                    }

                    if (!freeBeer) {
                        setDebt(prevDebt => prevDebt + price);
                    } else {
                        toast('Du vann en gratis öl (chansen var 0.5%)! 🍻');
                    }
                    setTransactions(currentTransactions => {
                        // Add the new transaction to the end of the array
                        const updatedTransactions = [transaction, ...currentTransactions];
                        // Slice the array to keep only the last 10 items
                        return updatedTransactions.slice(0, 10);
                    });
                    setItem(item);
                    setBeeredUser(null);
                } catch (error) {
                    toast.error(<CreateNewItemToast router={router} barcode={barcode} />);
                }
            }
        }
        performTransaction();
    }, [scanCount, user, barcode, router])

    const handleDropdownClick = (user: User) => {
        setTimeout(() => {
            if (divRef.current) {
                divRef.current.focus();
            }
        }, 200);

        setBeeredUser(user);
    }

    return (
        loading ?
            <div className='mx-auto mt-2'>
                <Spinner />
            </div>
            : (
                <div className="mx-auto p-3 md:w-1/2">
                    {user &&
                        <>
                            {beeredUser && (
                                <div className="mb-2" >
                                    <Card>
                                        <CardBody className="relative">
                                            <IoClose className="absolute top-2 right-2 cursor-pointer " onClick={() => setBeeredUser(null)} />
                                            <p className="pt-3">Du kommer bärsa: <span className="font-bold">{beeredUser.username}</span></p>
                                        </CardBody>
                                    </Card>
                                </div>
                            )}
                            <div>
                                <div className="flex justify-between focus:outline-none" ref={divRef} tabIndex={-1}>
                                    <div className="flex justify-between">
                                        <Avatar src={user.avatar ? user.avatar : DEFAULT_AVATAR_URL} className="mr-2 w-20 h-20" />
                                        <div>
                                            <h1 className="text-xl md:text-2xl font-bold mb-1">{user.username}</h1>
                                            <p className="text-sm">{user.firstName} {user.lastName} - {positionLabels[user.role]}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="w-full">
                                    {currentUsers && (user.role !== 'OTHER' && user.role !== 'KADAVER') && (
                                        <Dropdown shouldBlockScroll={false} >
                                            <DropdownTrigger>
                                                <Button
                                                    size="lg"
                                                    variant="bordered"
                                                    fullWidth
                                                    className="mb-2"
                                                >
                                                    <span>
                                                        Bärsa!
                                                    </span>
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu variant="faded" aria-label="Bärsa!">
                                                <DropdownSection title="Sittande">
                                                    {currentUsers.map((filteredUser) => (
                                                        <DropdownItem key={filteredUser.id} onClick={() => handleDropdownClick(filteredUser)}>
                                                            {filteredUser.username}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownSection>
                                            </DropdownMenu>
                                        </Dropdown>
                                    )}
                                </div>
                                {favoriteDrink &&
                                    <p><span className="font-bold">Favoritdryck: </span>{favoriteDrink.drink} <span className="text-sm">{favoriteDrink.count} st</span></p>}
                                <p><span className="font-bold">Skuld:</span> {debt} kr</p>
                            </div>

                            <Transactions transactions={transactions} />
                        </>
                    }

                </div>
            )
    );
}

