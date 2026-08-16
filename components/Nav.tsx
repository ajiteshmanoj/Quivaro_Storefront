"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/bank", label: "Bank" },
  { href: "/build", label: "Studio" },
];

export function Nav() {
  const pathname = usePathname();
  const { items, user, logout } = useStore();
  const count = items.filter((i) => i.kind === "question").length;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-baseline gap-10">
          <Link
            href="/"
            className="font-display text-[22px] font-bold tracking-tight text-accent"
          >
            Quivaro
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
          <span className="hidden rounded-full border border-hairline-dark px-3 py-1 text-[11px] font-medium tracking-wide text-soft md:block">
            Free during early access
          </span>
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2"
                title={user.tags.join(" · ")}
              >
                <span className="text-xs font-semibold tracking-[0.15em] text-ink">
                  {user.initials}
                </span>
                {user.tags[0] && (
                  <span className="hidden rounded-sm border border-gold/50 bg-gold-soft px-1.5 py-0.5 text-[10px] font-semibold text-gold sm:inline">
                    {user.tags[0]}
                  </span>
                )}
              </Link>
              <button
                onClick={logout}
                className="text-xs text-soft transition-colors hover:text-ink"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-sm bg-accent px-3.5 py-1.5 text-xs font-semibold text-paper transition-colors hover:bg-ink"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
