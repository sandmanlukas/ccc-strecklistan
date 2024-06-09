import { auth } from '@/auth';
import Unauthorized from '@/app/components/Unauthorized';
import AdminPage from '@/app/components/AdminPage';


export default async function Page() {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        return (
            <Unauthorized />
        );
    }

    return (
        <div className='m-auto'>
            <h1 className='text-2xl font-bold m-2 pl-1'>Adminsaker</h1>
            <AdminPage />
        </div>
    );
}
