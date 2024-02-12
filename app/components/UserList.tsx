"use client";

import React, { useEffect, useState } from 'react';
import { getAllUsers } from '@/app/lib/getAllUsers';
import { User } from '@prisma/client';

function UserList() {
    const [users, setUsers] = useState<User[] | null>();

    useEffect(() => {
        const fetchUsers = async () => {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        };
        console.log('fetching users');
        
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>All Users</h1>
            {users && (
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.username}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserList;