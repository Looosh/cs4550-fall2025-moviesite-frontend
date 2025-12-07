"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[--color-navbar] px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-[--color-primary] font-bold text-2xl">
        MovieHub
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/search" className="hover:text-[--color-primary]">
          Search
        </Link>

        {user ? (
          <>
            <Link href="/profile" className="hover:text-[--color-primary]">
              Profile
            </Link>
            <button
              className="hover:text-[--color-primary]"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-[--color-primary]">
              Login
            </Link>
            <Link href="/register" className="hover:text-[--color-primary]">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
