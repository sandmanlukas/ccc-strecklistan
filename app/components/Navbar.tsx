"use client";

import React from "react";
import verve from "@/fonts/verve";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SlLogout, SlLogin } from "react-icons/sl";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosAddCircleOutline, IoIosStats } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Session } from "next-auth";


type Props = {};

function AuthButton({ session }: { session: Session | null }) {
  if (session) {
    return (
      <>
        <p className="text-xl mr-4 self-end">
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
  const { data: session } = useSession();

  return (
    <nav
      className={
        verve.className +
        " text-black shadow-lg p-4 border-blue-700 bg-yellow-300 border-t-8 border-b-8 flex items-end items-center sticky top-0 z-50 relative"
      }
    >
      <div className="flex">
        <Link className="text-3xl self-end" href={"/"} as={"/"}>
          strecklistan
        </Link>
        {session && (
          <>
            {session.user.role === "ADMIN" && (
              <Link href={"/user/new"} as={"/user/new"} className="mx-2">
                <AiOutlineUserAdd size={35} style={{ fontWeight: 'bold' }} />
              </Link>
            )}
            <Link href={"/item/new"} as={"/item/new"} className="mx-2">
              <IoIosAddCircleOutline size={35} style={{ fontWeight: 'bold' }} />
            </Link>
            <Link href={"/stats"} as={"/stats"} className="mx-2">
              <IoIosStats size={35} style={{ fontWeight: 'bold' }} />
          </Link>
          </>
        )}
      </div>
      <div className="flex justify-end items-end w-full">
        {session && (
          <div className="flex">
            {session.user.role === "ADMIN" && (
              <Link href={"/admin"} as={"/admin"} className="mx-2">
                <MdOutlineAdminPanelSettings size={35} style={{ fontWeight: 'bold' }} />
              </Link>
            )}
            <AuthButton session={session} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
