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
        <div>
            <h1 className='text-2xl mb-2 pl-1'>Adminsaker</h1>
            <AdminUserList />
        </div>
    );
}
