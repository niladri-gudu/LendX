"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletConnect from "../wallet/WalletConnect";

export default function Navbar() {
  const pathname = usePathname();
  
  // Logic: Show the app navigation if we are on Dashboard OR History
  const showAppNav = pathname === "/dashboard" || pathname === "/history";

  return (
    <nav className="w-full border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            Lend<span className="text-indigo-400">X</span>
          </span>
        </Link>

        {/* Central Navigation - Stays visible on both app pages */}
        {showAppNav && (
          <div className="hidden md:flex items-center gap-1 bg-zinc-900/50 border border-zinc-800 p-1 rounded-xl">
            <NavLink href="/dashboard">Overview</NavLink>
            <NavLink href="/history">History</NavLink>
          </div>
        )}

        <div className="flex items-center gap-4">
          {!showAppNav ? (
            <Link
              href="/dashboard"
              className="bg-white text-black hover:bg-zinc-200 px-5 py-2 rounded-xl font-bold text-sm transition-all"
            >
              Launch App
            </Link>
          ) : (
            <div className="scale-90 md:scale-100 flex items-center gap-3">
              {/* Added a small network tag for better UI feel */}
              <div className="hidden sm:block px-2.5 py-1 rounded-md bg-zinc-800 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                Sepolia
              </div>
              <WalletConnect />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors rounded-lg ${
        isActive 
          ? "bg-zinc-800 text-indigo-400" 
          : "text-zinc-500 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}