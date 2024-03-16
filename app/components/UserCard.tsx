"use client";

import React from 'react';
import Link from 'next/link';
import { User } from '@prisma/client';
import Image from "next/image";

import { positionLabels } from '@/app/lib/utils';
import { DEFAULT_AVATAR_URL } from '@/app/constants';

function UserCard({ user }: { user: User }) {

    const isUserActive = !user.role.includes('KADAVER') && !user.role.includes('OTHER');
    return (
        <Link href={`/user/${user.id}`} as={`/user/${user.id}`}>
            <div className="shadow border rounded  bg-white min-h-[100px] flex flex-col justify-between p-4 overflow-clip cursor-pointer transition-all ease-in hover:shadow w-[250px] h-[300px] ">
                {
                    <Image alt="Användarens avatar" src={user.avatar ? user.avatar : DEFAULT_AVATAR_URL} width={250} height={250} className='rounded' />
                }
                <div>
                    <p className='text-xl font-bold mb-2'>{user.username}</p>
                    <p className='text-sm text-left mb-0'>{user.firstName} {user.lastName} {isUserActive && (<span>
                        - {positionLabels[user.role]}
                    </span>)}</p>
                </div>
            </div>
        </Link>
    );
}

export default UserCard;