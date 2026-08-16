"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/bank", label: "Bank" },
  { href: "/build", label: "Build" },
  { href: "/community", label: "Community" },
];

export function Nav() {
  const pathname = usePathname();
  const { items } = useStore();
  const count = items.filter((i) => i.kind === "question").length;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-baseline gap-10">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-tight text-ink"
          >
            Quivaro
            <span className="ml-0.5 text-accent">.</span>
          </Link>
          <nav className="flex items-baseline gap-7">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`label transition-colors hover:text-ink ${
                    active ? "text-ink" : ""
                  }`}
                >
                  {l.label}
                  {l.href === "/build" && count > 0 && (
                    <span className="ml-1.5 rounded-sm bg-accent-soft px-1.5 py-0.5 text-[10px] tabular-nums text-accent">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-faint sm:block">
            IB Mathematics · AA &amp; AI
          </span>
          <span className="rounded-full border border-hairline-dark px-3 py-1 text-[11px] font-medium tracking-wide text-soft">
            Free during early access
          </span>
        </div>
      </div>
    </header>
  );
}
