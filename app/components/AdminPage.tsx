"use client";

import React from "react";
import { useEffect } from "react";
import { Account, Item, Swish, Transaction, User } from "@prisma/client";
import { Listbox, ListboxItem, Skeleton, Selection, Tabs, Tab, Link, Spinner } from "@nextui-org/react";

import AdminUserCard from "@/app/components/AdminUserCard";
import AdminItemCard from "@/app/components/AdminItemCard";
import AdminDebtCollect from "@/app/components/AdminDebtCollect";
import AdminSwishInfo from "@/app/components/AdminSwishInfo";
import { AdminClearDatabase } from "@/app/components/AdminClearDatabase";
import { ListboxWrapper } from "@/app/components/ListboxWrapper";
import { getAllItems } from "@/app/lib/getAllItems";
import { getAllUsers } from "@/app/lib/getAllUsers";
import { getAllAccounts } from "@/app/lib/getAccounts";
import { getSwishInfo } from "@/app/lib/getSwishInfo";
import { itemTypes } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { AdminAccountSettings } from "./AdminAccountSettings";
import { getAllTransactionsWithoutBeeredUser } from "../lib/getAllTransactionsWithoutBeeredUser";
import { AdminTransactions } from "./AdminTransactions";
import { TransactionWithItemAndUser } from "./StatsPage";

export const TRANSACTION_PAGE_SIZE = 50;

export default function AdminPage() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [items, setItems] = React.useState<Item[]>([]);
    const [swish, setSwish] = React.useState<Swish | null>(null);
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [transactions, setTransactions] = React.useState<TransactionWithItemAndUser[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
    const [selectedUserKey, setSelectedUserKey] = React.useState<Selection>(new Set([users[0]?.id.toString()]));
    const [selectedItemKey, setSelectedItemKey] = React.useState<Selection>(new Set([items[0]?.id.toString()]));

    const [loadingUsers, setLoadingUsers] = React.useState(true);
    const [loadingItems, setLoadingItems] = React.useState(true);
    const [loadingSwish, setLoadingSwish] = React.useState(true);
    const [loadingAccounts, setLoadingAccounts] = React.useState(true);
    const [loadingTransactions, setLoadingTransactions] = React.useState(true);


    const handleUserUpdate = (updatedUser: User) => {
        setUsers(currentUsers => {
            return currentUsers.map(user => {
                if (user.id === updatedUser.id) {
                    return updatedUser; // Return the updated user
                }
                return user; // Return the unchanged user
            });
        });
    }

    const handleItemUpdate = (updatedItem: Item) => {
        setItems(currentItems => {
            return currentItems.map(item => {
                if (item.id === updatedItem.id) {
                    return updatedItem; // Return the updated item
                }
                return item; // Return the unchanged item
            });
        });
    }

    const handleUserDeletion = (deletedUser: User) => {
        setUsers(currentUsers => {
            const updatedUsers = currentUsers.filter(user => user.id !== deletedUser.id);
            if (selectedUser?.id === deletedUser.id) {
                setSelectedUser(updatedUsers[0]);
                setSelectedUserKey(new Set([updatedUsers[0].id.toString()]));
            }
            return updatedUsers;
        });
    }
    const handleItemDeletion = (deletedItem: Item) => {
        setItems(currentItems => {
            const updatedItems = currentItems.filter(item => item.id !== deletedItem.id);
            if (selectedItem?.id === deletedItem.id) {
                setSelectedItem(updatedItems[0]);
                setSelectedItemKey(new Set([updatedItems[0].id.toString()]));
            }
            return updatedItems;
        });
    }

    useEffect(() => {
        const rolesOrder = ['ORDFORANDE', 'KASSOR', 'BYGGCHEF', 'BILCHEF', 'GARDVAR', 'KLADCHEF', 'PROGRAMCHEF', 'ANNONSCHEF', 'MUSIKCHEF', 'OLCHEF', 'PRCHEF', 'KADAVER', 'OTHER'];
        const fetchUsers = async () => {
            setLoadingUsers(true);
            const users = await getAllUsers();
            if (!users) {
                toast.error("Kunde inte hämta användare");
                return;
            }
            users.sort((a, b) => {
                return rolesOrder.indexOf(a.role) - rolesOrder.indexOf(b.role);
            });
            setUsers(users);
            setSelectedUser(users[0]);
            setSelectedUserKey(new Set([users[0].id.toString()]));
            setLoadingUsers(false);
        }

        const fetchItems = async () => {
            setLoadingItems(true);
            const items = await getAllItems();
            if (!items) {
                toast.error("Kunde inte hämta inventarie");
                return;
            }
            setItems(items);
            setSelectedItem(items[0]);
            setSelectedItemKey(new Set([items[0]?.id.toString()]));
            setLoadingItems(false);
        }

        const fetchSwishInfo = async () => {
            setLoadingSwish(true);
            const swish = await getSwishInfo();

            if (swish == false) {
                toast.error("Kunde inte hämta Swish info");
                setLoadingSwish(false);
                return;
            }
            setSwish(swish);
            setLoadingSwish(false);
        }

        const fetchAccounts = async () => {
            setLoadingAccounts(true);
            const accounts = await getAllAccounts();
            if (!accounts) {
                toast.error("Kunde inte hämta konton");
                return;
            }
            setAccounts(accounts);
            setLoadingAccounts(false);
        }

        const fetchTransactions = async () => {
            setLoadingTransactions(true);
            const transactions = await getAllTransactionsWithoutBeeredUser(true, null, TRANSACTION_PAGE_SIZE, 0);
            if (!transactions) {
                toast.error("Kunde inte hämta transaktioner");
                return;
            }
            setTransactions(transactions);
            setLoadingTransactions(false);
        }

        fetchUsers();
        fetchItems();
        fetchSwishInfo();
        fetchAccounts();
        fetchTransactions();
    }, []);

    return (
        <div className="w-screen md:w-fit mx-auto overflow-auto">
            <Tabs aria-label="Tabbar för användare eller inventarie" fullWidth>
                <Tab key="users" title="Användare" className="w-[800px] md:w-full">
                    {users.length > 0 ? (
                        loadingUsers ? (
                            <div className="flex items-center justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <div className="grid grid-cols grid-cols-[1fr_2fr] gap-4">
                                <ListboxWrapper>
                                    <Listbox
                                        aria-label="Användare i systemet"
                                        variant="flat"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        items={users}
                                        selectedKeys={selectedUserKey}
                                        onSelectionChange={setSelectedUserKey}
                                        classNames={{
                                            base: "w-full md:max-w-xs",
                                            list: "w-full max-h-[300px] overflow-y-auto",
                                        }}
                                    >
                                        {(user) => (
                                            <ListboxItem key={user.id} textValue={user.username} onClick={() => setSelectedUser(user)}>
                                                <div className="flex gap-2 s-center">
                                                    <div className="flex flex-col">
                                                        <span className="text-small">{user.username}</span>
                                                        <span className="text-tiny text-default-400">{user.firstName} {user.lastName}</span>
                                                    </div>
                                                </div>
                                            </ListboxItem>
                                        )}
                                    </Listbox>
                                </ListboxWrapper>
                                <AdminUserCard user={selectedUser} onUserUpdate={handleUserUpdate} onUserDeletion={handleUserDeletion} />
                            </div>
                        )
                    ) : (
                        <div className="p-4 bg-white rounded-lg w-[800px]">
                            <p className="text-xl ">Inga användare hittades. Testa lägga till några användare
                                <Link className="ml-2 text-xl" href={"/user/new"}>här</Link>
                            </p>
                        </div>
                    )}
                </Tab>
                <Tab key="items" title="Inventarie" className="w-[800px] md:w-full">
                    {
                        items.length > 0 ?
                            (
                                loadingItems ? (
                                    <div className="flex items-center justify-center">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                                        <div className="">
                                            <ListboxWrapper>
                                                <Listbox
                                                    aria-label="Inventarie i systemet"
                                                    variant="flat"
                                                    disallowEmptySelection
                                                    selectionMode="single"
                                                    items={items}
                                                    selectedKeys={selectedItemKey}
                                                    onSelectionChange={setSelectedItemKey}
                                                    classNames={{
                                                        base: "max-w-xs",
                                                        list: "max-h-[300px] overflow-y-auto",
                                                    }}
                                                >
                                                    {(item) => (
                                                        <ListboxItem key={item.id} textValue={item.name} onClick={() => setSelectedItem(item)}>
                                                            <div className="flex gap-2 s-center">
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">{item.name}</span>
                                                                    <span className="text-tiny text-default-400">{item.price}kr - {itemTypes[item.type]}</span>
                                                                </div>
                                                            </div>
                                                        </ListboxItem>
                                                    )}
                                                </Listbox>
                                            </ListboxWrapper>
                                        </div>
                                        <AdminItemCard item={selectedItem} onItemUpdate={handleItemUpdate} onItemDeletion={handleItemDeletion} />
                                    </div>
                                )
                            ) : (
                                <div className="p-4 bg-white rounded-lg">
                                    <p className="text-xl ">Ingen inventarie hittades. Testa lägga till några grejer
                                        <Link className="ml-2 text-xl" href={"/item/new"}>här</Link>
                                    </p>
                                </div>

                            )}
                </Tab>
                <Tab key="debts" title="Samla in skulder">
                    {loadingSwish ? (
                        <div className="flex items-center justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        <AdminDebtCollect swish={swish} />
                    )}
                </Tab>
                <Tab key="swish" title="Swishinfo">
                    {loadingSwish ? (
                        <div className="flex items-center justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        <AdminSwishInfo swish={swish} />
                    )}
                </Tab>
                <Tab key="transactions" title="Transaktioner">
                    <Skeleton isLoaded={!loadingTransactions} className="rounded-lg">
                        <AdminTransactions transactions={transactions} />
                    </Skeleton>
                </Tab>
                <Tab key="passwordChange" title="Ändra kontoinställningar">
                    {loadingAccounts ? (
                        <div className="flex items-center justify-center">
                            <Spinner />
                        </div>
                    ) : (
                        <AdminAccountSettings accs={accounts} />
                    )}
                </Tab>
                <Tab key="clear_database" title="Rensa databas">
                    <AdminClearDatabase />
                </Tab>
            </Tabs>

        </div>
    );
}
