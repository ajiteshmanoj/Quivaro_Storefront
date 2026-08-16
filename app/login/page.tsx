"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, type MemberRole } from "@/lib/store";

const ROLES: { role: MemberRole; tag: string; note: string }[] = [
  {
    role: "IB certified teacher",
    tag: "IB Teacher",
    note: "Your votes carry the most weight in validating questions.",
  },
  {
    role: "Teacher",
    tag: "Teacher",
    note: "Vote on questions and build worksheets for your classes.",
  },
  {
    role: "Tutor",
    tag: "Tutor",
    note: "Build targeted practice for your students.",
  },
  {
    role: "Student",
    tag: "Student",
    note: "Browse the bank and practise with validated questions.",
  },
];

export default function LoginPage() {
  const { login, user } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState<MemberRole>("IB certified teacher");
  const joining = useRef(false);

  // already signed in (and not mid-join) → go to profile
  useEffect(() => {
    if (user && !joining.current) router.replace("/profile");
  }, [user, router]);

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          join the <span className="hl-gold">club</span> ✨
        </h1>
        <p className="mt-3 font-serif text-soft">
          Free during early access. Members who join now keep the{" "}
          <span className="font-semibold text-gold">Founding member</span> tag —
          and everything that comes with it — forever.
        </p>
      </div>

      <form
        className="mt-10 space-y-7"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          joining.current = true;
          login(name, role);
          router.push("/bank");
        }}
      >
        <div>
          <label className="label mb-2 block">Your name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Matthew Lee"
            autoFocus
            className="w-full border-b border-hairline-dark bg-transparent pb-2 font-serif text-lg text-ink outline-none transition-colors placeholder:text-faint focus:border-accent"
          />
        </div>

        <div>
          <label className="label mb-3 block">I am a…</label>
          <div className="space-y-2">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.role}
                onClick={() => setRole(r.role)}
                className={`block w-full border px-4 py-3 text-left transition-colors ${
                  role === r.role
                    ? "border-accent bg-accent-soft/70"
                    : "border-hairline bg-sheet hover:border-hairline-dark"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span
                    className={`text-sm font-semibold ${
                      role === r.role ? "text-accent" : "text-ink"
                    }`}
                  >
                    {r.role}
                  </span>
                  <span className="rounded-sm border border-gold/50 bg-gold-soft px-1.5 py-0.5 text-[10px] font-semibold text-gold">
                    {r.tag}
                  </span>
                </span>
                <span className="mt-1 block text-xs text-soft">{r.note}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className={`w-full rounded-full py-3 text-sm font-bold transition-all ${
            name.trim()
              ? "pop-btn bg-accent text-paper"
              : "border-2 border-hairline bg-hairline text-faint"
          }`}
        >
          count me in — it&apos;s free
        </button>

        <p className="text-center text-[11px] leading-relaxed text-faint">
          Prototype note: membership is stored locally in your browser. IB
          certification will be verified before the IB Teacher tag is granted in
          the live product.
        </p>
      </form>
    </main>
  );
}
