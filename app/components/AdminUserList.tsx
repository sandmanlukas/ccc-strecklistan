"use client";

import { useEffect } from "react";
import { getAllUsers } from "@/app/lib/getAllUsers";
import { User } from "@prisma/client";
import React from "react";
import { ListboxWrapper } from "@/app/components/ListboxWrapper";
import { Listbox, ListboxItem, Skeleton } from "@nextui-org/react";
import AdminUserCard from "./AdminUserCard";


export default function AdminUserList() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const users = await getAllUsers();
            setUsers(users);
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
                            classNames={{
                                base: "max-w-xs",
                                list: "max-h-[300px] overflow-scroll",
                            }}
                        // onSelectionChange={setSelectedKeys}
                        >
                            {(user) => (
                                <ListboxItem key={user.id} textValue={user.username} onClick={(e) => setSelectedUser(user)}>
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
                <AdminUserCard user={selectedUser} />
            </div>
        </Skeleton>
    );
}
