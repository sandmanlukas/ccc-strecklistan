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
      <div className="flex flex-row align-middle items-center">
        <p className="text-xl mr-4 mt-3">{session.user?.username}</p>
        <SlLogout
          onClick={() => {
            signOut({
              callbackUrl: "/signin",
            });
          }}
          size={35}
          className="font-bold cursor-pointer"
        />
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
        " text-black shadow-lg p-4 border-blue-700 bg-yellow-300 border-t-8 border-b-8 flex items-center align-middle sticky top-0 z-50 relative"
      }
    >
      <div className="flex flex-row justify-between w-full items-center">
        <Link className="text-3xl mt-3" href={"/"} as={"/"}>
          strecklistan
        </Link>
        <div className="flex flex-row">
          {session && (
            <>
              <div className="object-fit">
                <Link
                  href={"/swish"}
                  as={"/swish"}
                  className={`flex items-center align-middle text-3xl mt-3 mx-2 p-0 ${activeTab("/swish")}`}
                >
                  swish
                </Link>
              </div>
              <Link
                href={"/stats"}
                as={"/stats"}
                className={`flex align-middle items-center mx-2 ${activeTab(
                  "/stats"
                )}`}
              >
                <IoIosStats size={35} className="font-bold" />
              </Link>
              <Link
                href={"/item/new"}
                as={"/item/new"}
                className={`flex align-middle items-center mx-2 ${activeTab(
                  "/item/new"
                )}`}
              >
                <IoIosAddCircleOutline size={35} className="font-bold" />
              </Link>
              {session.user.role === "ADMIN" && (
                <>
                  <Link
                    href={"/user/new"}
                    as={"/user/new"}
                    className={` flex align-middle items-center mx-2 ${activeTab(
                      "/user/new"
                    )}`}
                  >
                    <AiOutlineUserAdd size={35} className="font-bold" />
                  </Link>
                  <Link
                    href={"/admin"}
                    as={"/admin"}
                    className={`flex align-middle items-center mx-2 ${activeTab(
                      "/admin"
                    )}`}
                  >
                    <MdOutlineAdminPanelSettings
                      size={35}
                      className="font-bold"
                    />
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
