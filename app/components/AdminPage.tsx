"use client";

import React from "react";
import { useEffect } from "react";
import { Account, Item, Swish, User } from "@prisma/client";
import { Listbox, ListboxItem, Skeleton, Selection, Tabs, Tab, Link } from "@nextui-org/react";

import AdminUserCard from "@/app/components/AdminUserCard";
import AdminItemCard from "@/app/components/AdminItemCard";
import AdminDebtCollect from "@/app/components/AdminDebtCollect";
import AdminSwishInfo from "@/app/components/AdminSwishInfo";
import { ListboxWrapper } from "@/app/components/ListboxWrapper";
import { getAllItems } from "@/app/lib/getAllItems";
import { getAllUsers } from "@/app/lib/getAllUsers";
import { getAllAccounts } from "@/app/lib/getAccounts";
import { getSwishInfo } from "@/app/lib/getSwishInfo";
import { itemTypes } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { AdminAccountSettings } from "./AdminAccountSettings";


export default function AdminPage() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [items, setItems] = React.useState<Item[]>([]);
    const [swish, setSwish] = React.useState<Swish | null>(null);
    const [accounts, setAccounts] = React.useState<Account[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
    const [selectedUserKey, setSelectedUserKey] = React.useState<Selection>(new Set([users[0]?.id.toString()]));
    const [selectedItemKey, setSelectedItemKey] = React.useState<Selection>(new Set([items[0]?.id.toString()]));

    const [loadingUsers, setLoadingUsers] = React.useState(true);
    const [loadingItems, setLoadingItems] = React.useState(true);
    const [loadingSwish, setLoadingSwish] = React.useState(true);
    const [loadingAccounts, setLoadingAccounts] = React.useState(true);


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
            if (!swish) {
                toast.error("Kunde inte hämta Swish info");
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

        fetchUsers();
        fetchItems();
        fetchSwishInfo();
        fetchAccounts();
    }, []);

    return (

        <div>
            <Tabs aria-label="Tabbar för användare eller inventarie">
                <Tab key="users" title="Användare">

                    {users.length > 0 ? (
                    <Skeleton isLoaded={!loadingUsers} className="rounded-lg">
                        <div className="grid grid-cols-[1fr_2fr] gap-4">
                            <div className="">
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
                                            base: "max-w-xs",
                                            list: "max-h-[300px] overflow-scroll",
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
                            </div>
                            <AdminUserCard user={selectedUser} onUserUpdate={handleUserUpdate} onUserDeletion={handleUserDeletion} />
                        </div>
                    </Skeleton>
                    ) : (
                        <div className="p-4 bg-white rounded-lg">
                            <p className="text-xl ">Inga användare hittades. Testa lägga till några användare
                                <Link className="ml-2 text-xl" href={"/user/new"}>här</Link>
                            </p>
                        </div>
                    )}
                </Tab>
                <Tab key="items" title="Inventarie">
                    {
                        items.length > 0 ?
                    (

                        <Skeleton isLoaded={!loadingItems} className="rounded-lg">
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
                                            list: "max-h-[300px] overflow-scroll",
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
                    </Skeleton>
                        ) : (
                            <div className="p-4 bg-white rounded-lg">
                                <p className="text-xl ">Ingen inventarie hittades. Testa lägga till några grejer
                                    <Link className="ml-2 text-xl" href={"/item/new"}>här</Link>
                                </p>
                            </div>
                        
                        )}
                </Tab>
                <Tab key="debts" title="Samla in skulder">
                    <Skeleton isLoaded={!loadingAccounts} className="rounded-lg">
                        <AdminDebtCollect swish={swish} />
                    </Skeleton>
                </Tab>
                <Tab key="swish" title="Swishinfo">
                    <Skeleton isLoaded={!loadingSwish} className="rounded-lg">
                        <AdminSwishInfo swish={swish} />
                    </Skeleton>
                </Tab>
                <Tab key="passwordChange" title="Ändra kontoinställningar">
                    <Skeleton isLoaded={!loadingAccounts} className="rounded-lg">
                        <AdminAccountSettings accs={accounts} />
                    </Skeleton>
                </Tab>
            </Tabs>

        </div>
    );
}
