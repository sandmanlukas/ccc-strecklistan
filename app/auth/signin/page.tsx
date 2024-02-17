import SignInForm from '@/app/components/SignInForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

async function SignInPage() {
    const session = await auth();
    
    if (session) {
        return redirect('/');
    }

    return (
        <div className='mx-auto grid place-items-center'>
            <SignInForm />
        </div>
    );

}

export default SignInPage;