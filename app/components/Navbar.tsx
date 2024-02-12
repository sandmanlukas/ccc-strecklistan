"use client";

import React from "react";
import verve from "@/fonts/verve";
import Link from "next/link";
import { useSession } from "next-auth/react";


type Props = {};

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session.user?.username} <br />
        <a href="/api/auth/signout">Logga ut</a>
      </>
    );
  }

  return (
    <>
      Inte inloggad <br />
      <a href="/api/auth/signin">Logga in</a>
    </>
  );
}

const Navbar = (props: Props) => {
  return (
    <nav
      className={
        verve.className +
        " text-black p-4 pb-2 shadow-lg border-blue-700 bg-yellow-300 border-t-8 border-b-8 flex justify-between items-center sticky top-0 z-50"
      }
    >
      <Link className={"text-3xl"} href={"/"} as={"/"}>
        strecklistan
      </Link>
      <AuthButton />
    </nav>
  );
};

export default Navbar;
