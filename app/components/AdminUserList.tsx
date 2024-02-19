"use client";

import React from "react";
import { useEffect } from "react";
import { User } from "@prisma/client";
import { Listbox, ListboxItem, Skeleton, Selection, user} from "@nextui-org/react";
import { getAllUsers } from "@/app/lib/getAllUsers";
import { ListboxWrapper } from "@/app/components/ListboxWrapper";
import AdminUserCard from "@/app/components/AdminUserCard";


export default function AdminUserList() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [selectedKey, setSelectedKey] = React.useState<Selection>(new Set([users[0]?.id.toString()]));

    const [loading, setLoading] = React.useState(true);

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

    const handleUserDeletion = (deletedUser: User) => {
        setUsers(currentUsers => {
            const updatedUsers = currentUsers.filter(user => user.id !== deletedUser.id);
            if (selectedUser?.id === deletedUser.id) {
                setSelectedUser(updatedUsers[0]);
                setSelectedKey(new Set([updatedUsers[0].id.toString()]));
            }
            return updatedUsers;
        });
    }

    // useEffect(() => {
    //     if (users.length > 0) {
    //         setSelectedUser(users[0]);
    //     } else {
    //         setSelectedUser(null);
    //     }
    // }, [users]); // Dependency array ensures this runs when `users` changes



    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const users = await getAllUsers();
            setUsers(users);
            setSelectedUser(users[0]);
            setSelectedKey(new Set([users[0].id.toString()]));
            setLoading(false);
        }

        fetchUsers();
    }, []);

    return (

        <Skeleton isLoaded={!loading} className="rounded-lg">
            <div className="grid grid-cols-[1fr_2fr] gap-4">
                <div className="">
                    <ListboxWrapper>
                        <Listbox
                            aria-label="Användare i systemet"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            items={users}
                            selectedKeys={selectedKey}
                            onSelectionChange={setSelectedKey}
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
    );
}
