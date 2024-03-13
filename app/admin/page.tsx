import { auth } from '@/auth';
import Unauthorized from '@/app/components/Unauthorized';
import AdminUserList from '@/app/components/AdminUserList';


export default async function AdminPage() {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        return (
            <Unauthorized />
        );
    }

    return (
        <div className='m-auto'>
            <h1 className='text-2xl my-2 pl-1'>Adminsaker</h1>
            <AdminUserList />
        </div>
    );
}
