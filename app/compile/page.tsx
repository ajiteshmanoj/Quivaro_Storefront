"use client";

import Link from "next/link";
import { TEMPLATES, noteById, questionById } from "@/lib/data";
import { MathText } from "@/components/MathText";
import { useStore } from "@/lib/store";

export default function CompilePage() {
  const { items, title, level, template, setTemplate, showAnswers, setShowAnswers } =
    useStore();

  const questions = items.filter((i) => i.kind === "question");
  const totalMarks = questions.reduce(
    (s, i) => s + (questionById(i.id)?.marks ?? 0),
    0
  );

  if (questions.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-display text-2xl text-soft">Nothing to compile yet.</p>
        <p className="mt-3 font-serif text-faint">
          Build a worksheet first — then come back for the paper.
        </p>
        <Link
          href="/build"
          className="mt-8 inline-block rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent"
        >
          ← Back to the Studio
        </Link>
      </main>
    );
  }

  const isExam = template === "examination";
  const isWorkbook = template === "workbook";
  const isCompact = template === "compact";
  const isPremium = template === "premium";

  const spacing = isCompact ? "space-y-5" : isWorkbook ? "space-y-8" : "space-y-9";
  const qTextSize = isCompact ? "text-[14px]" : "text-[15.5px]";

  let qNumber = 0;

  return (
    <main className="mx-auto max-w-5xl px-6">
      {/* controls */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-hairline py-8">
        <div className="flex items-center gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
                template === t.id
                  ? "bg-ink text-paper"
                  : "text-soft hover:bg-sheet hover:text-ink"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-soft">
            <span
              onClick={() => setShowAnswers(!showAnswers)}
              className={`inline-block h-3.5 w-7 rounded-full transition-colors ${
                showAnswers ? "bg-approve" : "bg-hairline-dark"
              }`}
            >
              <span
                className={`block h-3.5 w-3.5 rounded-full bg-sheet shadow transition-transform ${
                  showAnswers ? "translate-x-3.5" : ""
                }`}
              />
            </span>
            Answer key
          </label>
          <button
            onClick={() => window.print()}
            className="rounded-sm bg-ink px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-accent"
          >
            Print / Save PDF
          </button>
          <Link
            href="/build"
            className="text-xs text-soft underline decoration-hairline-dark underline-offset-4 hover:text-ink"
          >
            back to Studio
          </Link>
        </div>
      </div>

      {/* the sheet */}
      <div className="py-10">
        <div className="sheet mx-auto max-w-[720px] border border-hairline bg-white px-14 py-12 shadow-xl shadow-ink/10">
          {/* header, per template */}
          {isPremium && <div className="-mx-14 -mt-12 mb-10 h-2 bg-gold" />}

          {isExam ? (
            <header className="mb-10 text-center">
              <p className="label mb-3">IB Mathematics · {level}</p>
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                {title}
              </h1>
              <div className="mx-auto mt-6 flex max-w-md items-end justify-between border-t border-b border-ink py-2 text-[11px]">
                <span>
                  Name: ………………………………………
                </span>
                <span className="tabular-nums">Total: {totalMarks} marks</span>
              </div>
              <p className="mt-3 text-[10px] italic text-soft">
                Answer all questions. Working must be shown for full marks.
              </p>
            </header>
          ) : (
            <header
              className={`mb-10 ${isPremium ? "" : "border-b border-ink pb-5"}`}
            >
              <div className="flex items-end justify-between">
                <div>
                  <p className={`label mb-2 ${isPremium ? "!text-accent" : ""}`}>
                    IB Mathematics · {level}
                  </p>
                  <h1 className="font-display text-[26px] font-semibold tracking-tight">
                    {title}
                  </h1>
                </div>
                <p className="q-number">
                  {questions.length} questions · {totalMarks} marks
                </p>
              </div>
              {isPremium && <div className="mt-4 h-px bg-gold/60" />}
            </header>
          )}

          {/* body */}
          <div className={spacing}>
            {items.map((item) => {
              if (item.kind === "note") {
                const n = noteById(item.id);
                if (!n) return null;
                return (
                  <div
                    key={item.key}
                    className={
                      isPremium
                        ? "border-l-2 border-accent bg-accent-soft/50 px-5 py-4"
                        : "border border-ink/60 px-5 py-4"
                    }
                  >
                    <p
                      className={`label mb-2 ${isPremium ? "!text-accent" : "!text-ink"}`}
                    >
                      {n.title}
                    </p>
                    <p className={`font-serif ${qTextSize} leading-relaxed`}>
                      <MathText text={n.body} />
                    </p>
                  </div>
                );
              }
              const q = questionById(item.id);
              if (!q) return null;
              qNumber += 1;
              return (
                <div key={item.key} className="flex gap-4">
                  <span
                    className={`shrink-0 font-serif text-[15px] font-semibold ${
                      isPremium ? "text-accent" : ""
                    }`}
                  >
                    {qNumber}.
                  </span>
                  <div className="grow">
                    <p className={`font-serif ${qTextSize} leading-relaxed`}>
                      <MathText text={q.text} />
                    </p>
                    {isWorkbook && (
                      <div
                        className="ruled mt-3"
                        style={{ height: `${Math.min(q.marks, 6) * 34}px` }}
                      />
                    )}
                  </div>
                  <span className="q-number shrink-0 self-start">
                    [{q.marks}]
                  </span>
                </div>
              );
            })}
          </div>

          {/* answer key */}
          {showAnswers && (
            <section className="mt-12 border-t-2 border-ink pt-8">
              <h2
                className={`label mb-6 !text-[13px] ${
                  isPremium ? "!text-accent" : "!text-ink"
                }`}
              >
                Answer key
              </h2>
              <div className="space-y-5">
                {(() => {
                  let n = 0;
                  return items.map((item) => {
                    if (item.kind !== "question") return null;
                    const q = questionById(item.id);
                    if (!q) return null;
                    n += 1;
                    return (
                      <div key={item.key} className="flex gap-4">
                        <span className="shrink-0 font-serif text-[14px] font-semibold">
                          {n}.
                        </span>
                        <p className="font-serif text-[14px] leading-relaxed text-ink/90">
                          <MathText text={q.answer} />
                        </p>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>
          )}

          {/* footer */}
          <footer className="mt-14 flex items-center justify-between border-t border-hairline pt-4">
            <p className="text-[10px] text-faint">
              Compiled with Quivaro · quivaro.app — free during early access
            </p>
            <p className="text-[10px] tabular-nums text-faint">
              {level} · {totalMarks} marks
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
