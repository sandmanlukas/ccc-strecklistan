import UserList from "@/app/components/UserList";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) return redirect("api/auth/signin");

  return (
    <>
      <UserList />
    </>

  );
}

