"use client";

import React from "react";
import verve from "@/fonts/verve";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SlLogout, SlLogin } from "react-icons/sl";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";


type Props = {};

function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p className="text-xl mr-4">
          {session.user?.username}
        </p>
        <a href="/api/auth/signout">
          <SlLogout size={35} style={{ fontWeight: 'bold' }} />
        </a>
      </>
    );
  }

  return (
    <>
      <a href="/api/auth/signin">
        <SlLogin size={35} style={{ fontWeight: 'bold' }} />
      </a>
    </>
  );
}

const Navbar = (props: Props) => {
  return (
    <nav
      className={
        verve.className +
        " text-black shadow-lg p-4 border-blue-700 bg-yellow-300 border-t-8 border-b-8 flex items-end items-center sticky top-0 z-50 relative"
      }
    >
      <Link className={"text-3xl self-end flex-col"} href={"/"} as={"/"}>
        strecklistan
      </Link>
      <Link href={"/user/new"} as={"/user/new"} className="mx-2">
        <AiOutlineUserAdd size={35} style={{ fontWeight: 'bold' }} />
      </Link>
      <Link href={"/item/new"} as={"/item/new"} className="mx-2">
        <IoIosAddCircleOutline size={35} style={{ fontWeight: 'bold' }} />
      </Link>
      <div className="flex justify-end items-center w-full">
        <AuthButton />
      </div>
    </nav>
  );
};

export default Navbar;
