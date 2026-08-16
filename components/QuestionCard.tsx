"use client";

import { useState } from "react";
import Link from "next/link";
import { MathText } from "./MathText";
import { useStore } from "@/lib/store";
import { FLAG_REASONS, type FlagReason, type Question } from "@/lib/data";

export function LevelChips({ levels }: { levels: string[] }) {
  return (
    <span className="flex flex-wrap gap-1">
      {levels.map((l) => (
        <span
          key={l}
          className="rounded-sm border border-hairline px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-soft"
        >
          {l}
        </span>
      ))}
    </span>
  );
}

export function ValidationBadge({ count }: { count: number }) {
  if (count === 0)
    return (
      <span className="text-[11px] font-medium text-faint">awaiting votes</span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
      ▲ {count} teacher {count === 1 ? "vote" : "votes"}
    </span>
  );
}

export function QuestionCard({
  question,
  index,
  showAnswer,
}: {
  question: Question;
  index?: number;
  showAnswer?: boolean;
}) {
  const {
    addQuestion,
    flag,
    extraApprovals,
    localFlags,
    items,
    user,
    myVotes,
    toggleVote,
  } = useStore();
  const [flagOpen, setFlagOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);

  const inWorksheet = items.some(
    (i) => i.kind === "question" && i.id === question.id
  );
  const totalVotes = question.validations + (extraApprovals[question.id] ?? 0);
  const voted = !!myVotes[question.id];
  const flaggedLocally = localFlags[question.id];

  return (
    <article className="rise-in group border-t border-hairline py-6">
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          {index !== undefined && (
            <span className="q-number">{String(index + 1).padStart(2, "0")}</span>
          )}
          <span className="label">{question.topic}</span>
          <span className="hidden text-xs text-faint sm:inline">
            {question.subtopic}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LevelChips levels={question.levels} />
          <span className="q-number">[{question.marks}]</span>
        </div>
      </div>

      <p className="font-serif text-[17px] leading-relaxed text-ink">
        <MathText text={question.text} />
      </p>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          {/* the vote — ownership mechanic */}
          {user ? (
            <button
              onClick={() => toggleVote(question.id)}
              title={
                voted
                  ? "Remove your vote"
                  : "Vote this question up — your vote helps validate it for every member"
              }
              className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                voted
                  ? "border-gold/60 bg-gold-soft text-gold"
                  : "border-hairline text-soft hover:border-gold/50 hover:bg-gold-soft/50 hover:text-gold"
              }`}
            >
              ▲ {totalVotes}
            </button>
          ) : (
            <Link
              href="/login"
              title="Log in to vote — free during early access"
              className="inline-flex items-center gap-1.5 rounded-sm border border-hairline px-2.5 py-1 text-[12px] font-semibold text-soft transition-colors hover:border-hairline-dark hover:text-ink"
            >
              ▲ {totalVotes}
            </Link>
          )}
          <span className="hidden text-[11px] text-faint md:inline">
            {totalVotes === 0
              ? "awaiting votes"
              : `validated by ${totalVotes} ${totalVotes === 1 ? "member" : "members"}`}
          </span>
          {question.status === "flagged" && (
            <span className="rounded-sm bg-flag-soft px-2 py-0.5 text-[11px] font-medium text-flag">
              flagged — {question.flagReason}
            </span>
          )}
          {flaggedLocally && question.status !== "flagged" && (
            <span className="rounded-sm bg-flag-soft px-2 py-0.5 text-[11px] font-medium text-flag">
              you flagged — {flaggedLocally}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setAnswerOpen((v) => !v)}
            className="rounded-sm px-2 py-1 text-[11px] font-medium text-soft transition-colors hover:bg-sheet hover:text-ink"
          >
            {answerOpen ? "hide solution" : "solution"}
          </button>
          <div className="relative">
            <button
              onClick={() => setFlagOpen((v) => !v)}
              className="rounded-sm px-2 py-1 text-[11px] font-medium text-soft transition-colors hover:bg-flag-soft hover:text-flag"
            >
              flag
            </button>
            {flagOpen && (
              <div className="absolute right-0 top-8 z-20 w-44 rounded-md border border-hairline bg-sheet py-1 shadow-lg shadow-ink/5">
                {FLAG_REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      flag(question.id, r as FlagReason);
                      setFlagOpen(false);
                    }}
                    className="block w-full px-3 py-1.5 text-left text-xs text-soft transition-colors hover:bg-paper hover:text-ink"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => addQuestion(question.id)}
            disabled={inWorksheet}
            className={`ml-1 rounded-sm px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              inWorksheet
                ? "text-faint"
                : "bg-accent text-paper hover:bg-ink"
            }`}
          >
            {inWorksheet ? "in worksheet" : "+ add"}
          </button>
        </div>
      </div>

      {(answerOpen || showAnswer) && (
        <div className="rise-in mt-4 border-l-2 border-accent/40 bg-accent-soft/40 px-4 py-3">
          <p className="label mb-1.5 !text-accent">Worked solution</p>
          <p className="font-serif text-[15px] leading-relaxed text-ink/90">
            <MathText text={question.answer} />
          </p>
        </div>
      )}
    </article>
  );
}
