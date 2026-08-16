"use client";

import { useMemo, useState } from "react";
import { CONTRIBUTORS, QUESTIONS, questionById } from "@/lib/data";
import { QuestionCard } from "@/components/QuestionCard";
import { useStore } from "@/lib/store";

type Tab = "validated" | "review" | "factory" | "contributors";

const TABS: { id: Tab; label: string }[] = [
  { id: "validated", label: "Validated bank" },
  { id: "review", label: "Awaiting review" },
  { id: "factory", label: "Returned to factory" },
  { id: "contributors", label: "Contributors" },
];

export default function CommunityPage() {
  const { extraApprovals, localFlags, rejectedLog } = useStore();
  const [tab, setTab] = useState<Tab>("validated");

  const validated = useMemo(
    () =>
      QUESTIONS.filter((q) => q.status === "validated").sort(
        (a, b) =>
          b.validations +
          (extraApprovals[b.id] ?? 0) -
          (a.validations + (extraApprovals[a.id] ?? 0))
      ),
    [extraApprovals]
  );
  const unreviewed = QUESTIONS.filter((q) => q.status === "unreviewed");
  const flaggedBuiltIn = QUESTIONS.filter((q) => q.status === "flagged");

  const factoryQueue = useMemo(() => {
    const fromLog = rejectedLog.map((e) => ({
      question: questionById(e.id),
      reason: e.reason,
    }));
    const builtIn = flaggedBuiltIn.map((q) => ({
      question: q,
      reason: `Flagged — ${q.flagReason}`,
    }));
    return [...builtIn, ...fromLog].filter((e) => e.question);
  }, [rejectedLog, flaggedBuiltIn]);

  const localApprovalCount = Object.values(extraApprovals).reduce(
    (s, n) => s + n,
    0
  );

  const stats: [string, string][] = [
    [String(validated.length), "validated questions"],
    [String(unreviewed.length), "awaiting review"],
    [String(factoryQueue.length), "returned to factory"],
    [
      String(CONTRIBUTORS.reduce((s, c) => s + c.approvals, 0) + localApprovalCount),
      "total approvals",
    ],
  ];

  return (
    <main className="mx-auto max-w-6xl px-6">
      <div className="border-b border-hairline py-10">
        <h1 className="font-display text-4xl font-medium tracking-tight">
          The Community
        </h1>
        <p className="mt-2 max-w-xl font-serif text-soft">
          Every question is validated by practising IB teachers before it earns
          its place. A question is promoted only when several independent
          approvals agree — one voice is never enough.
        </p>
      </div>

      {/* stats */}
      <div className="flex flex-wrap gap-x-14 gap-y-6 border-b border-hairline py-8">
        {stats.map(([n, l]) => (
          <div key={l}>
            <p className="font-display text-3xl font-light tabular-nums">{n}</p>
            <p className="label mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* founding banner */}
      <div className="mt-8 border border-accent/30 bg-accent-soft/50 px-6 py-4">
        <p className="font-serif text-[15px] text-ink">
          <span className="font-semibold text-accent">Founding contributors</span>{" "}
          — teachers who validate questions during early access keep full access,
          free, forever. Your approvals are weighted by how well they hold up,
          not by how many you make.
        </p>
      </div>

      {/* tabs */}
      <div className="mt-10 flex gap-1 border-b border-hairline">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-4 py-2.5 text-[13px] font-medium transition-colors ${
              tab === t.id ? "text-ink" : "text-soft hover:text-ink"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      <div className="py-6">
        {tab === "validated" && (
          <div>
            {validated.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} />
            ))}
          </div>
        )}

        {tab === "review" && (
          <div>
            <p className="mb-4 font-serif text-sm italic text-faint">
              Fresh from the factory — not yet served to worksheets ranked by
              validation. Approve what holds up; flag what doesn&rsquo;t.
            </p>
            {unreviewed.map((q, i) => (
              <QuestionCard key={q.id} question={q} index={i} />
            ))}
          </div>
        )}

        {tab === "factory" && (
          <div>
            <p className="mb-4 font-serif text-sm italic text-faint">
              Rejected in preview or flagged by teachers — queued for repair or
              regeneration. Flagged questions are never served.
            </p>
            {factoryQueue.length === 0 && (
              <p className="py-12 text-center font-serif italic text-faint">
                The queue is empty.
              </p>
            )}
            <ul className="divide-y divide-hairline">
              {factoryQueue.map((e, i) => (
                <li key={i} className="flex items-baseline justify-between gap-6 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-[15px] text-ink">
                      {e.question!.subtopic} —{" "}
                      <span className="text-soft">{e.question!.topic}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-faint">{e.question!.id}</p>
                  </div>
                  <span className="shrink-0 rounded-sm bg-flag-soft px-2 py-0.5 text-[11px] font-medium text-flag">
                    {e.reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "contributors" && (
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-hairline text-left">
                  <th className="label pb-3 font-medium">Teacher</th>
                  <th className="label pb-3 font-medium">School</th>
                  <th className="label pb-3 text-right font-medium">Approvals</th>
                  <th className="label pb-3 text-right font-medium">Hold-up rate</th>
                  <th className="label pb-3 text-right font-medium">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {CONTRIBUTORS.map((c) => (
                  <tr key={c.name} className="group">
                    <td className="py-3.5 font-serif text-[15px]">{c.name}</td>
                    <td className="py-3.5 text-sm text-soft">{c.school}</td>
                    <td className="py-3.5 text-right text-sm tabular-nums">
                      {c.approvals}
                    </td>
                    <td className="py-3.5 text-right text-sm tabular-nums text-soft">
                      {c.accuracy}%
                    </td>
                    <td className="py-3.5 text-right">
                      {c.founding ? (
                        <span className="rounded-full border border-accent/40 bg-accent-soft px-2.5 py-0.5 text-[11px] font-medium text-accent">
                          founding
                        </span>
                      ) : (
                        <span className="text-[11px] text-faint">member</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 max-w-lg text-[11px] leading-relaxed text-faint">
              Hold-up rate is the share of a contributor&rsquo;s approvals that
              were not later flagged by other teachers. Approvals from
              contributors with a low hold-up rate carry less weight when
              promoting a question.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
