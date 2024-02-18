"use client";

import React from 'react';
import Link from 'next/link';
import { User } from '@prisma/client';

function UserCard({ user }: { user: User} ) {
    return (
        <Link href={`/user/${user.id}`} as={`/user/${user.id}`}>
        <div className="shadow border rounded  bg-white min-h-[100px] justify-between p-4 overflow-clip cursor-pointer transition-all ease-in hover:shadow ">
            <p className='text-xl font-bold'>{user.username}</p>
            <p className='text-sm text-left'>{user.firstName} {user.lastName}</p>
        </div>
        </Link>
    );
}

export default UserCard;