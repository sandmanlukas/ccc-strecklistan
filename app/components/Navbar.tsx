"use client";

import React, { useState } from "react";
import verve from "@/fonts/verve";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { SlLogout, SlLogin } from "react-icons/sl";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosAddCircleOutline, IoIosStats } from "react-icons/io";
import { IoReceiptOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

type Props = {};

function AuthButton({ session }: { session: Session | null }) {
  if (session) {
    return (
      <div
        className="md:ml-0 flex flex-row align-middle items-center"
      >
        <p className="hidden md:block text-xl mr-4 mt-3 mt-0">{session.user?.username}</p>
        <SlLogout
          onClick={() => {
            signOut({
              callbackUrl: "/signin",
            });
          }}
          size={35}
          className="align-left cursor-pointer"
        />
        <p className="md:hidden text-xl ml-4 mt-2">logga ut</p>
      </div>
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
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const activeTab = (route: string) => {
    if (pathname === route) {
      return "border-b-2 border-black";
    }
    return "";
  };

  return (
    <nav
      className={
        verve.className +
        " text-black shadow-lg p-4 border-blue-700 bg-yellow-300 border-t-8 border-b-8 items-center align-middle sticky top-0 z-50 relative"
      }
    >
      <div className="md:flex md:flex-row justify-between md:w-full md:items-center">
        <div className="flex flex-row justify-between">
          {session && (
            <RxHamburgerMenu size={35} onClick={() => setIsHamburgerOpen(!isHamburgerOpen)} className="md:hidden pt-3" />
          )}
          <Link className="text-3xl pt-3" href={"/"} as={"/"}>
            strecklistan
          </Link>
          {session && (
            <>
              <p className="md:hidden text-xl ml-3 mt-4">{session.user?.username}</p>
              <Link className={`hidden md:block text-3xl ml-3 mt-3`} href={"/recent"} as={"/recent"}>
                <IoReceiptOutline size={35} />
              </Link>
            </>
          )}
        </div>
        <div className={`${isHamburgerOpen ? 'flex' : 'hidden'} flex-col md:flex md:flex-row items-start md:items-center w-full md:w-auto ${isHamburgerOpen && 'rounded'}`}>
          {session && (
            <>
              <Link className={`flex align-middle items-center mx-2 sm:hidden mb-2`} href={"/recent"} as={"/recent"}>
                <IoReceiptOutline size={35} className="md:hidden" />
                <span className=" md:hidden ml-2 text-lg mt-2">senaste transaktionerna</span>
              </Link>
              <div className="object-fit flex mb-2">
                <FaRegMoneyBillAlt size={35} className="ml-2 md:hidden" />
                <Link
                  href={"/swish"}
                  as={"/swish"}
                  className={`flex items-center align-middle text-lg md:text-3xl md:mt-3 mx-2 p-0 ${activeTab("/swish")}`}
                >
                  swish
                </Link>
              </div>
              <Link
                href={"/stats"}
                as={"/stats"}
                className={`flex align-middle items-center mx-2 mb-2 ${activeTab(
                  "/stats"
                )}`}
              >
                <IoIosStats size={35} />
                <span className=" md:hidden ml-2 text-lg mt-2">statistik</span>
              </Link>
              <Link
                href={"/item/new"}
                as={"/item/new"}
                className={`flex align-middle items-center mx-2 mb-2 ${activeTab(
                  "/item/new"
                )}`}
              >
                <IoIosAddCircleOutline size={35} />
                <span className="md:hidden ml-2 text-lg mt-2">lägg till inventarie</span>
              </Link>
              {session.user.role === "ADMIN" && (
                <>
                  <Link
                    href={"/user/new"}
                    as={"/user/new"}
                    className={` flex align-middle items-center mx-2 mb-2 ${activeTab(
                      "/user/new"
                    )}`}
                  >
                    <AiOutlineUserAdd size={35} />
                    <span className="md:hidden ml-2 text-lg mt-2">lägg till användare</span>
                  </Link>
                  <Link
                    href={"/admin"}
                    as={"/admin"}
                    className={`flex align-middle items-center mx-2 mb-2 ${activeTab(
                      "/admin"
                    )}`}
                  >
                    <MdOutlineAdminPanelSettings
                      size={35}
                    />
                    <span className="md:hidden ml-2 text-lg mt-2">adminsidor</span>
                  </Link>
                </>
              )}
              <AuthButton session={session} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
