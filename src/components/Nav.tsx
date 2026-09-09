"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import InstallMenuButton from "@/components/InstallMenuButton";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/syllabus", label: "Syllabus" },
  { href: "/quiz", label: "Quiz" },
  { href: "/pyq", label: "PYQ" },
  { href: "/planner", label: "Planner" },
  { href: "/optional", label: "Optional" },
  { href: "/interview", label: "Interview" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/methodology", label: "Methodology" },
  { href: "/search", label: "Search" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-[#0f2744]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-lg font-bold text-[#0f2744]">
            IAS
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">UPSC IAS Study Hub</div>
            <div className="text-[11px] text-slate-300">Syllabus · Trends · Practice</div>
          </div>
        </Link>

        <button
          type="button"
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav className="hidden flex-wrap items-center justify-end gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition",
                  active ? "bg-amber-500 text-[#0f2744]" : "text-slate-200 hover:bg-white/10"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <InstallMenuButton className="ml-1" />
        </nav>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 py-3 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    active ? "bg-amber-500 text-[#0f2744]" : "bg-white/5 text-white"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
            <InstallMenuButton className="col-span-2" />
          </div>
        </nav>
      )}
    </header>
  );
}
