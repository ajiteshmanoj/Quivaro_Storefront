"use client";

import Link from "next/link";
import { QUESTIONS, questionById } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function ProfilePage() {
  const { user, myVotes, localFlags, rejectedLog, logout } = useStore();

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-display text-2xl text-soft">You&rsquo;re not signed in.</p>
        <Link
          href="/beta"
          className="mt-8 inline-block rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink"
        >
          Enter the beta
        </Link>
      </main>
    );
  }

  const voteCount = Object.keys(myVotes).length;
  const flagCount = Object.keys(localFlags).length;
  const votedQuestions = Object.keys(myVotes)
    .map((id) => questionById(id))
    .filter(Boolean)
    .slice(0, 6);

  const stats: [string, string][] = [
    [String(voteCount), "questions you validated"],
    [String(flagCount), "flags raised"],
    [String(rejectedLog.length), "sent back to the factory"],
    [String(QUESTIONS.length), "questions in the bank"],
  ];

  return (
    <main className="mx-auto max-w-4xl px-6">
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-hairline py-12">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent font-display text-xl font-bold text-paper">
            {user.initials.replace(" ", "")}
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {user.name}
            </h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {user.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-gold/50 bg-gold-soft px-2 py-0.5 text-[11px] font-semibold text-gold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs text-soft underline decoration-hairline-dark underline-offset-4 transition-colors hover:text-ink"
        >
          Log out
        </button>
      </div>

      <div className="flex flex-wrap gap-x-14 gap-y-6 border-b border-hairline py-8">
        {stats.map(([n, l]) => (
          <div key={l}>
            <p className="font-display text-3xl font-bold tabular-nums">{n}</p>
            <p className="label mt-1">{l}</p>
          </div>
        ))}
      </div>

      <section className="py-10">
        <h2 className="label mb-4">Questions you validated</h2>
        {votedQuestions.length === 0 ? (
          <p className="font-serif italic text-faint">
            None yet — head to the{" "}
            <Link href="/bank" className="text-accent underline underline-offset-2">
              Bank
            </Link>{" "}
            and vote on questions that hold up. Your votes shape what other
            teachers are served.
          </p>
        ) : (
          <ul className="divide-y divide-hairline">
            {votedQuestions.map((q) => (
              <li key={q!.id} className="flex items-baseline justify-between gap-6 py-3">
                <p className="truncate font-serif text-[15px] text-ink">
                  {q!.subtopic}{" "}
                  <span className="text-soft">— {q!.topic}</span>
                </p>
                <span className="shrink-0 text-[11px] font-semibold text-gold">
                  ▲ voted
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t border-hairline py-8">
        <p className="max-w-xl text-[13px] leading-relaxed text-soft">
          <span className="font-semibold text-ink">How validation works.</span>{" "}
          A question is promoted only when several members vote for it — never
          on one voice. Votes from{" "}
          <span className="font-semibold text-gold">IB Teacher</span> members
          carry the most weight, and votes that later get flagged by others
          reduce how much your future votes count. Flags and rejections go back
          to the factory for repair.
        </p>
      </section>
    </main>
  );
}
