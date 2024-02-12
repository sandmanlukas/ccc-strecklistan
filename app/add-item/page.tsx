import React from 'react';
import {redirect} from 'next/navigation';

import { auth } from '@/auth';
import AddItemForm from '../components/AddItemForm';

async function AddItemPage({children,}:{children: React.ReactNode}) {

    const session = await auth();

    if (!session || session.user.role != 'ADMIN') return redirect('/');

    return (
        <AddItemForm/>
    );
}

export default AddItemPage;