import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import Navbar from "@/app/components/Navbar";
import { auth } from "@/auth";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Strecklistan",
  description: "CCCs strecklista",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();


  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-neutral-50">
        <Providers>
          <SessionProvider session={session}>
            <Navbar />
            <main className="mx-auto max-w-5l text-2xl flex">
              {children}
            </main>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}