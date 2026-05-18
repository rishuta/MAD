"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, PenSquare, Plus, Search, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/create", label: "Write" }
];

export function Navbar() {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-sm">
      <nav className="app-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[#0F172A]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3B82F6] text-[#FFFFFF]">
            <PenSquare size={17} />
          </span>
          <span className="text-lg font-semibold tracking-[-0.01em]">BlogSpace</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-[#F8FAFC] text-[#0F172A]" : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button aria-label="Search" className="hidden h-9 w-9 place-items-center rounded-full text-[#94A3B8] transition hover:bg-[#F8FAFC] hover:text-[#0F172A] sm:grid">
            <Search size={17} />
          </button>

          {isLoaded && !isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC] sm:inline-flex">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-full bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569]">
                  Sign up
                </button>
              </SignUpButton>
            </>
          ) : null}

          {isLoaded && isSignedIn ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-full bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569] sm:inline-flex">
                <Plus size={16} />
                New post
              </Link>
              <UserButton />
            </>
          ) : null}

          <button aria-label="Open menu" onClick={() => setIsOpen((value) => !value)} className="grid h-9 w-9 place-items-center rounded-full text-[#475569] transition hover:bg-[#F8FAFC] md:hidden">
            {isOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-[#E2E8F0] bg-[#FFFFFF] p-3 md:hidden"
          >
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#475569] transition hover:bg-[#F1F5F9]">
                {item.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
