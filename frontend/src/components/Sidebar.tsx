"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Database, ShieldAlert, Cpu, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAppStore();

  if (pathname === "/" && !role) return null;

  const employerLinks = [
    { href: "/employer/dashboard", label: "Dashboard", icon: Terminal, id: "01" },
    { href: "#", label: "My Projects", icon: Database, id: "02" },
    { href: "#", label: "Milestones", icon: Activity, id: "03" },
    { href: "#", label: "Settings", icon: Cpu, id: "04" },
  ];

  const freelancerLinks = [
    { href: "/freelancer/dashboard", label: "Dashboard", icon: Terminal, id: "01" },
    { href: "#", label: "Find Work", icon: Database, id: "02" },
    { href: "#", label: "Earnings", icon: Activity, id: "03" },
    { href: "#", label: "Notifications", icon: ShieldAlert, id: "04" },
  ];

  const links = role === "employer" ? employerLinks : freelancerLinks;

  return (
    <aside className="w-64 border-r border-border bg-base hidden md:flex flex-col">
      <div className="p-4 border-b border-border">
        <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase block mb-1">Platform Status</span>
        <div className="flex items-center gap-2 text-xs font-mono text-secondary">
          <div className="w-2 h-2 bg-secondary animate-pulse"></div>
          All Systems Operational
        </div>
      </div>
      
      <div className="flex-1 py-4 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "group flex items-center justify-between px-6 py-4 transition-all duration-200 border-l-2",
                isActive
                  ? "border-accent bg-border text-foreground"
                  : "border-transparent text-gray-500 hover:text-foreground hover:bg-border/50"
              )}
            >
              <div className="flex items-center gap-4">
                <Icon size={16} className={cn(isActive ? "text-accent" : "text-gray-600 group-hover:text-gray-400")} />
                <span className="text-sm font-semibold tracking-wide uppercase">{link.label}</span>
              </div>
              <span className="text-[10px] font-mono opacity-50">{link.id}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
