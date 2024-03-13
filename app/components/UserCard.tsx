"use client";

import React from 'react';
import Link from 'next/link';
import { User } from '@prisma/client';

import { positionLabels } from '@/app/lib/utils';

function UserCard({ user }: { user: User} ) {

    const isUserActive = !user.role.includes('KADAVER') && !user.role.includes('OTHER');
    return (
        <Link href={`/user/${user.id}`} as={`/user/${user.id}`}>
        <div className="shadow border rounded  bg-white min-h-[100px] justify-between p-4 overflow-clip cursor-pointer transition-all ease-in hover:shadow ">
            <p className='text-xl font-bold mb-2'>{user.username}</p>
            <p className='text-sm text-left mb-0'>{user.firstName} {user.lastName} {isUserActive && (<span>
                - {positionLabels[user.role]}
            </span>)}</p>
        </div>
        </Link>
    );
}

export default UserCard;