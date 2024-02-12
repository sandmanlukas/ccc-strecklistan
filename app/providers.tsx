// app/providers.tsx
import { auth } from "@/auth";

import SessionProvider from "@/app/components/SessionProvider"
export async function Providers({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <SessionProvider session={session   }>
            {children}
        </SessionProvider>
    )
}