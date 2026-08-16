"use client";

import { useMemo, useState } from "react";
import { LEVELS, QUESTIONS, TOPICS, type Level, type Topic } from "@/lib/data";
import { QuestionCard } from "@/components/QuestionCard";
import { useStore } from "@/lib/store";

type StatusFilter = "all" | "validated" | "unreviewed" | "flagged";

export default function BankPage() {
  const { extraApprovals } = useStore();
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [levels, setLevels] = useState<Level[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (topic !== "all" && q.topic !== topic) return false;
      if (levels.length > 0 && !q.levels.some((l) => levels.includes(l)))
        return false;
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
  }, [topic, levels, status, query, extraApprovals]);

  const topicCounts = useMemo(() => {
    const counts = new Map<Topic, number>();
    for (const q of QUESTIONS)
      counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
    return counts;
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6">
      <div className="border-b border-hairline py-10">
        <h1 className="font-display text-4xl font-medium tracking-tight">
          The Bank
        </h1>
        <p className="mt-2 max-w-lg font-serif text-soft">
          Ranked by teacher validation. Approve what holds up, flag what
          doesn&rsquo;t — flags return to the factory for repair.
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
            <p className="label mb-3">Level</p>
            <ul className="space-y-1.5">
              {LEVELS.map((l) => {
                const on = levels.includes(l);
                return (
                  <li key={l}>
                    <button
                      onClick={() =>
                        setLevels((prev) =>
                          on ? prev.filter((x) => x !== l) : [...prev, l]
                        )
                      }
                      className="flex items-center gap-2 text-sm text-soft transition-colors hover:text-ink"
                    >
                      <span
                        className={`inline-block h-3 w-3 border transition-colors ${
                          on
                            ? "border-accent bg-accent"
                            : "border-hairline-dark bg-sheet"
                        }`}
                      />
                      <span className={on ? "font-medium text-ink" : ""}>{l}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
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
