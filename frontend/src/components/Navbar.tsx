"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Terminal, LogOut } from "lucide-react";

export function Navbar() {
  const { role, setRole } = useAppStore();
  const pathname = usePathname();

  if (pathname === "/" && !role) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-base/90 backdrop-blur-xl">
      <div className="flex h-14 items-center px-6">
        <div className="flex items-center gap-3 font-display font-bold text-xl tracking-tighter text-foreground uppercase">
          <div className="w-8 h-8 bg-accent text-base flex items-center justify-center">
            <Terminal size={18} />
          </div>
          OrbitFlow
        </div>

        <div className="ml-auto flex items-center space-x-6">
          {role && (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-none mb-1">
                  Logged in as
                </span>
                <span className="text-sm font-mono text-secondary uppercase leading-none">
                  {role === "employer" ? "Employer" : "Freelancer"}
                </span>
              </div>
              
              <div className="w-px h-8 bg-border"></div>
              
              <Link
                href="/"
                onClick={() => setRole(null)}
                className="group flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-accent transition-colors uppercase tracking-widest"
              >
                <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
