"use client";

import React, { useEffect, useState } from 'react';
import { getAllUsers } from '@/app/lib/getAllUsers';
import { User } from '@prisma/client';
import {Spinner} from "@nextui-org/react";
import UserCard from './UserCard';
import { toast } from 'react-toastify';
import { set } from 'zod';

function UserList() {
    const [activeUsers, setActiveUsers] = useState<User[] | null>();
    const [oldUsers, setOldUsers] = useState<User[] | null>();
    const [otherUsers, setOtherUsers] = useState<User[] | null>();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                setLoading(true);
                const allUsers = await getAllUsers();
                const activeUsers = allUsers.filter(user => !user.role.includes('KADAVER') || !user.role.includes('OTHER'));
                const oldUsers = allUsers.filter(user => user.role.includes('KADAVER'));
                const otherUsers = allUsers.filter(user => user.role.includes('OTHER'));
                setActiveUsers(activeUsers);
                setOldUsers(oldUsers);
                setOtherUsers(otherUsers);
            } catch (error) {
                console.error(error);
                toast.error('Något gick fel!')
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

    }, []);

    const noUsers = !activeUsers && !oldUsers && !otherUsers;

    return (
        loading ? 
        <div className='mx-auto my-auto mt-20'>
            <Spinner />
        </div>
            : (
                <div className='mx-auto p-3'>
                    {noUsers ? (
                        <h1 className="text-2xl font-bold mb-4">Inga användare</h1>
                    ) : (
                        <>
                        {activeUsers && activeUsers.length > 0 &&
                            <div className='mb-2'>
                            <h1 className="text-2xl font-bold mb-4">Sittande</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {activeUsers.map(user => (
                                <UserCard key={user.id} user={user} />
                                ))}
                                </div>
                                </div>
                            }
                        {oldUsers && oldUsers.length > 0 &&
                            <div className='mb-2'>  
                            <h1 className="text-2xl font-bold mb-4">Kadaver</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {oldUsers.map(user => (
                                <UserCard key={user.id} user={user} />
                                ))}
                                </div>
                                </div>
                            }
                        {otherUsers && otherUsers.length > 0 &&
                            <>  
                            <h1 className="text-2xl font-bold mb-4">Kadaver</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {otherUsers.map(user => (
                                <UserCard key={user.id} user={user} />
                                ))}
                                </div>
                                </>
                            }
                        </>
                    )}
                </div>
            )
    );
}

export default UserList;