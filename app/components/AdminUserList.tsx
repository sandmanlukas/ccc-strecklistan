"use client";

import React from "react";
import { useEffect } from "react";
import { Item, User } from "@prisma/client";
import { Listbox, ListboxItem, Skeleton, Selection, Tabs, Tab } from "@nextui-org/react";

import AdminUserCard from "@/app/components/AdminUserCard";
import AdminItemCard from "@/app/components/AdminItemCard";
import { ListboxWrapper } from "@/app/components/ListboxWrapper";
import { getAllItems } from "@/app/lib/getAllItems";
import { getAllUsers } from "@/app/lib/getAllUsers";
import { itemTypes } from "@/app/lib/utils";
import AdminDebtCollect from "./AdminDebtCollect";


export default function AdminUserList() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [items, setItems] = React.useState<Item[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);
    const [selectedUserKey, setSelectedUserKey] = React.useState<Selection>(new Set([users[0]?.id.toString()]));
    const [selectedItemKey, setSelectedItemKey] = React.useState<Selection>(new Set([items[0]?.id.toString()]));

    const [loadingUsers, setLoadingUsers] = React.useState(true);
    const [loadingItems, setLoadingItems] = React.useState(true);

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
        const fetchUsers = async () => {
            setLoadingUsers(true);
            const users = await getAllUsers();
            setUsers(users);
            setSelectedUser(users[0]);
            setSelectedUserKey(new Set([users[0].id.toString()]));
            setLoadingUsers(false);
        }

        const fetchItems = async () => {
            setLoadingItems(true);
            const items = await getAllItems();
            setItems(items);
            setSelectedItem(items[0]);
            setSelectedItemKey(new Set([items[0].id.toString()]));
            setLoadingItems(false);
        }

        fetchUsers();
        fetchItems();
    }, []);

    return (

        <div>
            <Tabs aria-label="Tabbar för användare eller inventarie">
                <Tab key="users" title="Användare">
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
                </Tab>
                <Tab key="items" title="Inventarie">
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
                </Tab>
                <Tab key="debts" title="Samla in skulder">
                   <AdminDebtCollect />
                </Tab>
            </Tabs>

        </div>
    );
}
