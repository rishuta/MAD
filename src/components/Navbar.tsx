"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { PenSquare } from "lucide-react";

export function Navbar() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-black text-white">
            <PenSquare size={18} />
          </span>
          Simple Blog
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/" className="hidden text-sm font-medium text-neutral-600 hover:text-black sm:inline">
            Home
          </Link>
          <Link href="/create" className="hidden text-sm font-medium text-neutral-600 hover:text-black sm:inline">
            Create Post
          </Link>

          {isLoaded && !isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-neutral-100">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800">
                  Sign up
                </button>
              </SignUpButton>
            </>
          ) : null}

          {isLoaded && isSignedIn ? <UserButton /> : null}
        </div>
      </nav>
    </header>
  );
}
