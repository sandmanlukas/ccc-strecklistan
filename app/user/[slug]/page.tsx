import UserPage from '@/app/components/UserPage';

export default function Page({ params }: { params: { slug: string } }) {
    return (
       <UserPage id={parseInt(params.slug)}/>
    );
  }

