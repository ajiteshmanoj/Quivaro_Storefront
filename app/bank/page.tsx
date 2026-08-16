"use client";

import { useMemo, useState } from "react";
import { CONTRIBUTORS, QUESTIONS, TOPICS, type Topic } from "@/lib/data";
import { QuestionCard } from "@/components/QuestionCard";
import { useStore } from "@/lib/store";

type StatusFilter = "all" | "validated" | "unreviewed" | "flagged";

export default function BankPage() {
  const { extraApprovals } = useStore();
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [subjects, setSubjects] = useState<("AA" | "AI")[]>([]);
  const [bands, setBands] = useState<("HL" | "SL")[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (topic !== "all" && q.topic !== topic) return false;
      // factory categorisation: subject (AA/AI) and level band (HL/SL)
      const levelOk = q.levels.some((l) => {
        const [subj, band] = l.split(" ") as ["AA" | "AI", "HL" | "SL"];
        const subjOk = subjects.length === 0 || subjects.includes(subj);
        const bandOk = bands.length === 0 || bands.includes(band);
        return subjOk && bandOk;
      });
      if (!levelOk) return false;
      if (status !== "all" && q.status !== status) return false;
      if (
        query &&
        !(q.text + q.subtopic + q.topic).toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    }).sort(
      (a, b) =>
        b.validations +
        (extraApprovals[b.id] ?? 0) -
        (a.validations + (extraApprovals[a.id] ?? 0))
    );
  }, [topic, subjects, bands, status, query, extraApprovals]);

  const topicCounts = useMemo(() => {
    const counts = new Map<Topic, number>();
    for (const q of QUESTIONS)
      counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
    return counts;
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6">
      <div className="border-b border-hairline py-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          the bank 🏦
        </h1>
        <p className="mt-2 max-w-lg font-serif text-soft">
          Served from the factory&rsquo;s question database — categorised by
          subject, topic and level, ranked by member votes. Vote for what holds
          up; flags return to the factory for repair.
        </p>
      </div>

      <div className="grid gap-12 py-8 md:grid-cols-[210px_1fr]">
        {/* filter rail */}
        <aside className="space-y-8 md:sticky md:top-20 md:self-start">
          <div>
            <p className="label mb-3">Topic</p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setTopic("all")}
                  className={`text-sm transition-colors hover:text-ink ${
                    topic === "all" ? "font-medium text-ink" : "text-soft"
                  }`}
                >
                  All topics
                </button>
              </li>
              {TOPICS.map((t) => (
                <li key={t} className="flex items-baseline justify-between gap-2">
                  <button
                    onClick={() => setTopic(t)}
                    className={`text-left text-sm transition-colors hover:text-ink ${
                      topic === t ? "font-medium text-ink" : "text-soft"
                    }`}
                  >
                    {t}
                  </button>
                  <span className="q-number">{topicCounts.get(t)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-3">Subject</p>
            <div className="flex gap-1.5">
              {(["AA", "AI"] as const).map((sub) => {
                const on = subjects.includes(sub);
                return (
                  <button
                    key={sub}
                    onClick={() =>
                      setSubjects((prev) =>
                        on ? prev.filter((x) => x !== sub) : [...prev, sub]
                      )
                    }
                    className={`flex-1 rounded-sm border px-2 py-1.5 text-xs font-semibold transition-colors ${
                      on
                        ? "border-accent bg-accent text-paper"
                        : "border-hairline text-soft hover:border-hairline-dark hover:text-ink"
                    }`}
                  >
                    Math {sub}
                  </button>
                );
              })}
            </div>
            <p className="label mb-3 mt-5">Level</p>
            <div className="flex gap-1.5">
              {(["HL", "SL"] as const).map((b) => {
                const on = bands.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() =>
                      setBands((prev) =>
                        on ? prev.filter((x) => x !== b) : [...prev, b]
                      )
                    }
                    className={`flex-1 rounded-sm border px-2 py-1.5 text-xs font-semibold transition-colors ${
                      on
                        ? "border-accent bg-accent text-paper"
                        : "border-hairline text-soft hover:border-hairline-dark hover:text-ink"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="label mb-3">Status</p>
            <ul className="space-y-1">
              {(
                [
                  ["all", "All"],
                  ["validated", "Validated"],
                  ["unreviewed", "Awaiting review"],
                  ["flagged", "Flagged"],
                ] as [StatusFilter, string][]
              ).map(([v, label]) => (
                <li key={v}>
                  <button
                    onClick={() => setStatus(v)}
                    className={`text-sm transition-colors hover:text-ink ${
                      status === v ? "font-medium text-ink" : "text-soft"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-hairline pt-6">
            <p className="label mb-3">Top members</p>
            <ul className="space-y-2.5">
              {CONTRIBUTORS.slice(0, 5).map((c) => (
                <li key={c.name} className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-ink">
                      {c.name}
                    </span>
                    <span className="mt-0.5 flex gap-1">
                      <span className="rounded-sm border border-gold/50 bg-gold-soft px-1 py-px text-[9px] font-semibold text-gold">
                        IB Teacher
                      </span>
                      {c.founding && (
                        <span className="rounded-sm border border-gold/50 bg-gold-soft px-1 py-px text-[9px] font-semibold text-gold">
                          Founding
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="q-number shrink-0">▲ {c.approvals}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-faint">
              Votes from IB Teacher members carry the most weight. Votes that
              later get flagged reduce a member&rsquo;s future weight.
            </p>
          </div>
        </aside>

        {/* results */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions…"
              className="w-full max-w-sm border-b border-hairline-dark bg-transparent pb-2 font-serif text-[15px] text-ink outline-none transition-colors placeholder:text-faint focus:border-accent"
            />
            <span className="q-number shrink-0">
              {filtered.length} {filtered.length === 1 ? "question" : "questions"}
            </span>
          </div>

          {filtered.length === 0 ? (
            <p className="py-16 text-center font-serif italic text-faint">
              Nothing matches — loosen a filter.
            </p>
          ) : (
            filtered.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
