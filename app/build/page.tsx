"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  NOTES,
  TEMPLATES,
  TOPICS,
  LEVELS,
  noteById,
  questionById,
  type Level,
  type Topic,
} from "@/lib/data";
import { MathText } from "@/components/MathText";
import { LevelChips, ValidationBadge } from "@/components/QuestionCard";
import { useStore, type BuildItem } from "@/lib/store";

/* ---------- notes insertion popover ---------- */

function NoteInserter({
  index,
  topicsPresent,
}: {
  index: number;
  topicsPresent: Topic[];
}) {
  const { insertNote, items } = useStore();
  const [open, setOpen] = useState(false);
  const usedNotes = new Set(
    items.filter((i) => i.kind === "note").map((i) => i.id)
  );
  const candidates = [...NOTES]
    .filter((n) => !usedNotes.has(n.id))
    .sort((a, b) => {
      const ar = topicsPresent.includes(a.topic) ? 0 : 1;
      const br = topicsPresent.includes(b.topic) ? 0 : 1;
      return ar - br || b.validations - a.validations;
    });

  return (
    <div className="relative">
      <div className="group flex h-6 items-center justify-center">
        <div className="h-px w-full bg-transparent transition-colors group-hover:bg-hairline" />
        <button
          onClick={() => setOpen((v) => !v)}
          className={`absolute rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide transition-all ${
            open
              ? "border-accent bg-accent text-paper"
              : "border-transparent text-transparent group-hover:border-hairline-dark group-hover:bg-sheet group-hover:text-soft"
          }`}
        >
          ⌇ insert notes
        </button>
      </div>
      {open && (
        <div className="absolute left-1/2 z-30 w-80 -translate-x-1/2 rounded-md border border-hairline bg-sheet py-1 shadow-xl shadow-ink/10">
          <p className="label px-3 pb-1 pt-2">Notes chunks</p>
          {candidates.length === 0 && (
            <p className="px-3 py-2 text-xs text-faint">
              All chunks are already placed.
            </p>
          )}
          {candidates.slice(0, 6).map((n) => (
            <button
              key={n.id}
              onClick={() => {
                insertNote(index, n.id);
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left transition-colors hover:bg-paper"
            >
              <span className="block text-[13px] font-medium text-ink">
                {n.title}
              </span>
              <span className="block text-[11px] text-faint">
                {n.topic} · validated by {n.validations}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- canvas items ---------- */

function CanvasQuestion({
  item,
  number,
}: {
  item: BuildItem;
  number: number;
}) {
  const { rejectQuestion, removeItem, moveItem } = useStore();
  const q = questionById(item.id);
  if (!q) return null;

  return (
    <div
      className={`group border border-hairline bg-sheet px-6 py-5 transition-shadow hover:shadow-md hover:shadow-ink/5 ${
        item.replacing ? "replacing" : "rise-in"
      }`}
    >
      {item.replacing ? (
        <div className="flex h-20 items-center justify-center">
          <p className="font-serif text-sm italic text-faint">
            retrieving a replacement from {q.topic}…
          </p>
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="q-number">
                {String(number).padStart(2, "0")}
              </span>
              <span className="label">{q.subtopic}</span>
            </div>
            <div className="flex items-center gap-3">
              <LevelChips levels={q.levels} />
              <span className="q-number">[{q.marks}]</span>
            </div>
          </div>
          <p className="font-serif text-[16px] leading-relaxed text-ink">
            <MathText text={q.text} />
          </p>
          <div className="mt-3 flex items-center justify-between">
            <ValidationBadge count={q.validations} />
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => moveItem(item.key, -1)}
                className="rounded-sm px-1.5 py-1 text-[11px] text-soft hover:bg-paper hover:text-ink"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => moveItem(item.key, 1)}
                className="rounded-sm px-1.5 py-1 text-[11px] text-soft hover:bg-paper hover:text-ink"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                onClick={() => rejectQuestion(item.key)}
                className="rounded-sm px-2 py-1 text-[11px] font-medium text-soft transition-colors hover:bg-accent-soft hover:text-accent"
                title="Reject — a replacement from the same topic is retrieved; the rejected question returns to the factory"
              >
                reject ↻
              </button>
              <button
                onClick={() => removeItem(item.key)}
                className="rounded-sm px-2 py-1 text-[11px] text-soft hover:bg-paper hover:text-ink"
              >
                remove
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CanvasNote({ item }: { item: BuildItem }) {
  const { rejectNote, removeItem, moveItem } = useStore();
  const n = noteById(item.id);
  if (!n) return null;

  return (
    <div
      className={`group border-l-2 border-accent/50 bg-accent-soft/40 px-6 py-5 ${
        item.replacing ? "replacing" : "rise-in"
      }`}
    >
      {item.replacing ? (
        <div className="flex h-14 items-center justify-center">
          <p className="font-serif text-sm italic text-faint">
            regenerating notes chunk…
          </p>
        </div>
      ) : (
        <>
          <div className="mb-1.5 flex items-baseline justify-between">
            <p className="label !text-accent">⌇ Notes — {n.title}</p>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => moveItem(item.key, -1)}
                className="rounded-sm px-1.5 py-1 text-[11px] text-soft hover:text-ink"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => moveItem(item.key, 1)}
                className="rounded-sm px-1.5 py-1 text-[11px] text-soft hover:text-ink"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                onClick={() => rejectNote(item.key)}
                className="rounded-sm px-2 py-1 text-[11px] font-medium text-soft hover:text-accent"
              >
                regenerate ↻
              </button>
              <button
                onClick={() => removeItem(item.key)}
                className="rounded-sm px-2 py-1 text-[11px] text-soft hover:text-ink"
              >
                remove
              </button>
            </div>
          </div>
          <p className="font-serif text-[15px] leading-relaxed text-ink/90">
            <MathText text={n.body} />
          </p>
        </>
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default function BuildPage() {
  const {
    items,
    title,
    setTitle,
    level,
    setLevel,
    template,
    setTemplate,
    autoBuild,
    clearWorksheet,
    hydrated,
  } = useStore();
  const [selTopics, setSelTopics] = useState<Topic[]>(["Calculus"]);
  const [count, setCount] = useState(6);

  const questions = items.filter((i) => i.kind === "question");
  const totalMarks = questions.reduce(
    (s, i) => s + (questionById(i.id)?.marks ?? 0),
    0
  );
  const topicsPresent = useMemo(
    () =>
      Array.from(
        new Set(
          questions
            .map((i) => questionById(i.id)?.topic)
            .filter((t): t is Topic => Boolean(t))
        )
      ),
    [questions]
  );

  let qNumber = 0;

  return (
    <main className="mx-auto max-w-6xl px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline py-10">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            the studio 🛠️
          </h1>
          <p className="mt-2 max-w-lg font-serif text-soft">
            Review every question before it reaches paper. Reject one and a
            replacement arrives from the same topic; the reject returns to the
            factory.
          </p>
        </div>
        <Link
          href="/compile"
          className={`rounded-sm px-5 py-2.5 text-sm font-medium transition-colors ${
            questions.length > 0
              ? "bg-ink text-paper hover:bg-accent"
              : "pointer-events-none bg-hairline text-faint"
          }`}
        >
          Compile PDF →
        </Link>
      </div>

      <div className="grid gap-12 py-8 lg:grid-cols-[1fr_280px]">
        {/* canvas */}
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-6 w-full border-b border-transparent bg-transparent font-display text-2xl font-medium text-ink outline-none transition-colors hover:border-hairline focus:border-accent"
            aria-label="Worksheet title"
          />

          {!hydrated || items.length === 0 ? (
            <div className="border border-dashed border-hairline-dark px-8 py-20 text-center">
              <p className="font-display text-xl text-soft">
                An empty sheet of paper.
              </p>
              <p className="mx-auto mt-3 max-w-sm font-serif text-sm leading-relaxed text-faint">
                Retrieve questions with the panel on the right, or add them
                one-by-one from the Bank. Hover between items to interleave
                notes — practice becomes teaching material.
              </p>
            </div>
          ) : (
            <div>
              <NoteInserter index={0} topicsPresent={topicsPresent} />
              {items.map((item) => {
                if (item.kind === "question") qNumber += 1;
                const idx = items.indexOf(item);
                return (
                  <div key={item.key}>
                    {item.kind === "question" ? (
                      <CanvasQuestion item={item} number={qNumber} />
                    ) : (
                      <CanvasNote item={item} />
                    )}
                    <NoteInserter index={idx + 1} topicsPresent={topicsPresent} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* control rail */}
        <aside className="space-y-8 lg:sticky lg:top-20 lg:self-start">
          <div>
            <p className="label mb-3">Retrieve questions</p>
            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map((t) => {
                const on = selTopics.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() =>
                      setSelTopics((prev) =>
                        on ? prev.filter((x) => x !== t) : [...prev, t]
                      )
                    }
                    className={`rounded-sm border px-2 py-1 text-[11px] font-medium transition-colors ${
                      on
                        ? "border-ink bg-ink text-paper"
                        : "border-hairline text-soft hover:border-hairline-dark hover:text-ink"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={15}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-16 border-b border-hairline-dark bg-transparent pb-1 text-center text-sm tabular-nums outline-none focus:border-accent"
                aria-label="Number of questions"
              />
              <button
                onClick={() => autoBuild(selTopics, count)}
                className="flex-1 rounded-sm border border-ink px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Retrieve from bank
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-faint">
              Simulates vector retrieval from the storefront database —
              flagged questions are never served.
            </p>
          </div>

          <div>
            <p className="label mb-3">Level</p>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="w-full border-b border-hairline-dark bg-transparent pb-1.5 text-sm outline-none focus:border-accent"
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="label mb-3">Paper template</p>
            <div className="space-y-1.5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`block w-full border px-3 py-2 text-left transition-colors ${
                    template === t.id
                      ? "border-accent bg-accent-soft/60"
                      : "border-hairline bg-sheet hover:border-hairline-dark"
                  }`}
                >
                  <span
                    className={`block text-[13px] font-medium ${
                      template === t.id ? "text-accent" : "text-ink"
                    }`}
                  >
                    {t.name}
                  </span>
                  <span className="block text-[11px] text-faint">
                    {t.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-hairline pt-5">
            <div className="flex items-baseline justify-between">
              <span className="label">Questions</span>
              <span className="font-display text-xl tabular-nums">
                {questions.length}
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="label">Total marks</span>
              <span className="font-display text-xl tabular-nums">
                {totalMarks}
              </span>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearWorksheet}
                className="mt-4 text-[11px] text-faint underline decoration-hairline underline-offset-2 transition-colors hover:text-accent"
              >
                clear worksheet
              </button>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
