"use client";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { useAppSelector } from "@/store/hook";
import Image from "next/image";
import DrawerSidebar from "./DrawerSidebar";

export default function Header() {
  const auth = useAppSelector((state: any) => state.auth);
  return (
    <header className="w-full flex items-center justify-between px-6 h-16 ">
      <div className="flex items-center gap-1">
        {/* Hamburger menu for mobile */}
        <DrawerSidebar />
        <Link href={'/'} className="flex items-center gap-1">
          <Image
            src={"/kuvaka_logo.png"}
            width={30}
            height={30}
            alt="kuvaka-logo"
          />
          <span className="font-bold text-lg text-[#a246ff]">Kuvaka</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://www.kuvaka.io/thekuvakaprocess"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:block text-sm text-gray-700 dark:text-gray-200 hover:underline"
        >
          About kuvaka
        </a>
        {auth.isAuthenticated ? (
          <UserMenu phone={auth.phone} />
        ) : (
          <Link className="ml-2" href={"/login"}>
            <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
              Sign in
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
