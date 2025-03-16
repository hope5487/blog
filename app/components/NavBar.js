"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import NotificationDropdown from "./NotificationDropdown";
import SettingsDropdown from "./SettingsDropdown";
import AuthButton from "./AuthButton";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10 transition-colors">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
            내 블로그
          </Link>
          
          <div className="w-full md:w-1/2">
            <SearchBar />
          </div>
          
          <div className="flex items-center space-x-4">
            {session && (
              <NotificationDropdown />
            )}
            <SettingsDropdown />
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}