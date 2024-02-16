import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

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
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <main className="mx-auto max-w-10xl text-xl flex">
              {children}
            </main>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}