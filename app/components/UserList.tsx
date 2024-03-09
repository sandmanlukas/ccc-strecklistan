"use client";

import React, { useEffect, useState } from 'react';
import { getAllUsers } from '@/app/lib/getAllUsers';
import { User } from '@prisma/client';
import {Spinner} from "@nextui-org/react";
import UserCard from './UserCard';
import { toast } from 'react-toastify';

function UserList() {
    const [activeUsers, setActiveUsers] = useState<User[] | null>();
    const [nonActiveUsers, setNonActiveUsers] = useState<User[] | null>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                setLoading(true);
                const allUsers = await getAllUsers();
                const activeUsers = allUsers.filter(user => !user.role.includes('KADAVER'));
                const nonActiveUsers = allUsers.filter(user => user.role.includes('KADAVER'));
                setActiveUsers(activeUsers);
                setNonActiveUsers(nonActiveUsers);
            } catch (error) {
                console.error(error);
                toast.error('Något gick fel!')
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

    }, []);

    return (
        loading ? 
        <div className='mx-auto my-auto mt-20'>
            <Spinner />
        </div>
            : (
                <div className='mx-auto p-3'>
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
                    {nonActiveUsers && nonActiveUsers.length > 0 &&
                        <>  
                            <h1 className="text-2xl font-bold mb-4">Kadaver</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {nonActiveUsers.map(user => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                        </>
                    }
                </div>
            )
    );
}

export default UserList;