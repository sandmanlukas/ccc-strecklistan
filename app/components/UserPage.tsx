"use client";

import { getUser } from "@/app/lib/getUser";
import { Spinner } from "@nextui-org/react";
import { User } from "@prisma/client"
import { useEffect, useState } from "react"

export default function UserPage({ id }: { id: number }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const user = await getUser(id);
            setUser(user);
            setLoading(false);
        }
        fetchUser();
    
    }, [])
    

    return (
        loading ? 
        <div className='mx-auto mt-2'>
            <Spinner />
        </div>
            : (
                <div className='mx-auto p-3'>
                    {user &&
                        <>
                            <h1 className="text-2xl font-bold mb-4">{user.username}</h1>
                            <p className="text-md">{user.firstName} {user.lastName}</p>
                            <p className="text-md">{user.email}</p>
                        </>
                    }
                    
                </div>
            )
    );
  }

