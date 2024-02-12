import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "Strecklistan",
  description: "CCCs strecklista",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-neutral-50">
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-5l text-2xl flex">
          {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}