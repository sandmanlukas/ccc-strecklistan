"use client";

import React from "react";
import verve from "@/fonts/verve";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { SlLogout, SlLogin } from "react-icons/sl";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosAddCircleOutline, IoIosStats } from "react-icons/io";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import Image from "next/image";


type Props = {};

function AuthButton({ session }: { session: Session | null }) {
  if (session) {
    return (
      <>
        <p className="text-xl mr-4 self-end">
          {session.user?.username}
        </p>
        <SlLogout
          onClick={() => {
            signOut({
              callbackUrl: "/signin",
            });
          }}
          size={35} className="font-bold cursor-pointer" />
      </>
    );
  }

  return (
    <>
      <a href="/api/auth/signin">
        <SlLogin size={35} className="font-bold cursor-pointer" />
      </a>
    </>
  );
}

const Navbar = (props: Props) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const activeTab = (route: string) => {
    if (pathname === route) {
      return "border-b-2 border-black";
    }
    return "";
  }

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
              <Link href={"/user/new"} as={"/user/new"} className={`mx-2 ${activeTab("/user/new")}`}>
                <AiOutlineUserAdd size={35} className="font-bold" />
              </Link>
            )}
            <Link href={"/item/new"} as={"/item/new"} className={`mx-2 ${activeTab("/item/new")}`}>
              <IoIosAddCircleOutline size={35} className="font-bold" />
            </Link>
            <Link href={"/stats"} as={"/stats"} className={`mx-2 ${activeTab("/stats")}`}>
              <IoIosStats size={35} className="font-bold" />
            </Link>
            <Link href={"/swish"} as={"/swish"} className={`mx-2 p-0 ${activeTab("/swish")}`}>
              <Image src="/swish.png" alt="Swishloggan" width={300} height={300} className="p-0"/>
            </Link>

          </>
        )}
      </div>
      <div className="flex justify-end items-end w-full">
        {session && (
          <div className="flex">
            {session.user.role === "ADMIN" && (
              <Link href={"/admin"} as={"/admin"} className={`mx-2 ${activeTab("/admin")}`}>
                <MdOutlineAdminPanelSettings size={35} className="font-bold" />
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
