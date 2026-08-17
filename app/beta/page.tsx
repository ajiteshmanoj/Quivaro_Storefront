"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BETA_TOKENS, DISCORD_URL } from "@/lib/data";
import { useStore, type MemberRole } from "@/lib/store";

const ROLES: { role: MemberRole; tag: string }[] = [
  { role: "IB certified teacher", tag: "IB Teacher" },
  { role: "Teacher", tag: "Teacher" },
  { role: "Tutor", tag: "Tutor" },
  { role: "Student", tag: "Student" },
];

export default function BetaPage() {
  const { betaToken, redeemToken, login, user } = useStore();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<MemberRole>("IB certified teacher");

  const tokenAccepted = !!betaToken;

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="text-center">
        <p className="mx-auto mb-5 inline-block rounded-full border-2 border-ink bg-gold-soft px-4 py-1.5 text-xs font-bold tracking-wide text-ink">
          PRIVATE BETA 🎟️
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          got a <span className="hl-gold">token</span>?
        </h1>
        <p className="mt-3 text-soft">
          No accounts. No passwords. A handful of invite tokens go out each day
          — through the Discord and directly to IB teachers and school
          administrators on LinkedIn.
        </p>
      </div>

      {!tokenAccepted ? (
        <div className="mt-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (redeemToken(code)) {
                setError(false);
              } else {
                setError(true);
              }
            }}
          >
            <label className="label mb-2 block">Invite token</label>
            <div className="flex gap-3">
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(false);
                }}
                placeholder="QVR-XXXXX"
                autoFocus
                className="w-full border-b-2 border-hairline-dark bg-transparent pb-2 font-display text-xl font-bold tracking-widest text-ink outline-none transition-colors placeholder:text-faint focus:border-accent"
              />
              <button
                type="submit"
                disabled={!code.trim()}
                className={`shrink-0 px-5 py-2 text-sm ${
                  code.trim()
                    ? "pop-btn bg-accent text-paper"
                    : "rounded-full border-2 border-hairline bg-hairline text-faint"
                }`}
              >
                enter
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm font-semibold text-flag">
                That token isn&rsquo;t valid. New invites drop daily — grab one
                in the Discord.
              </p>
            )}
          </form>

          <div className="pop-card mt-10 p-6 text-center">
            <p className="font-display text-lg font-bold text-ink">
              No token yet?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-soft">
              Join the Discord — that&rsquo;s where the beta lives. Feedback
              threads, worksheet showcases, and a small batch of invite tokens
              every day.
            </p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pop-btn mt-5 inline-block bg-[#5865F2] px-6 py-2.5 text-sm text-white"
            >
              join the Discord →
            </a>
            <p className="mt-4 text-[11px] text-faint">
              Teachers &amp; school admins: we&rsquo;re also issuing tokens
              directly over LinkedIn — no queue.
            </p>
          </div>
        </div>
      ) : (
        <form
          className="mt-10 space-y-7"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            login(name, role, ["Beta tester"]);
            router.push("/build");
          }}
        >
          <div className="pop-card p-4 text-center">
            <p className="text-sm font-bold text-accent">
              ✓ token accepted — {betaToken}
            </p>
            <p className="mt-1 text-xs text-faint">
              {BETA_TOKENS.find((t) => t.code === betaToken)?.issuedTo
                ? `issued to ${BETA_TOKENS.find((t) => t.code === betaToken)!.issuedTo}`
                : "welcome to the beta"}
            </p>
          </div>

          <div>
            <label className="label mb-2 block">What should we call you?</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="w-full border-b-2 border-hairline-dark bg-transparent pb-2 font-display text-lg font-bold text-ink outline-none transition-colors placeholder:text-faint focus:border-accent"
            />
          </div>

          <div>
            <label className="label mb-3 block">You are a…</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  type="button"
                  key={r.role}
                  onClick={() => setRole(r.role)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                    role === r.role
                      ? "border-accent bg-accent-soft/70 text-accent"
                      : "border-hairline bg-sheet text-ink hover:border-hairline-dark"
                  }`}
                >
                  {r.tag}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-3 text-sm ${
              name.trim()
                ? "pop-btn bg-accent text-paper"
                : "rounded-full border-2 border-hairline bg-hairline text-faint"
            }`}
          >
            enter the beta →
          </button>

          {user && (
            <p className="text-center text-[11px] text-faint">
              Already set up as {user.name} — submitting will update your
              details.
            </p>
          )}
        </form>
      )}

      <p className="mt-10 text-center text-[11px] leading-relaxed text-faint">
        Prototype note: tokens are validated in-browser for the demo. The live
        beta checks tokens server-side and each code is single-use.
      </p>
    </main>
  );
}
