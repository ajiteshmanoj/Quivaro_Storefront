# Quivaro Storefront

The IB Mathematics worksheet studio — Math AA HL·SL and AI HL·SL.

Teachers build worksheets from a community-validated question bank, reject
questions in preview (a replacement is retrieved from the same topic; rejects
return to the factory), interleave notes chunks between exercises, and compile
to print-ready PDF in five paper templates. Everything is free during early
access; founding contributors keep full access forever.

## Surfaces

- **`/bank`** — browse the question bank, ranked by teacher validation; approve,
  flag (wrong answer / out of syllabus / wrong level / ambiguous), add to worksheet
- **`/build`** — the Studio: retrieve questions by topic, review gate with
  reject→replace, notes interleaving, template picker
- **`/compile`** — print-ready sheet in 5 templates (Examination, Classic,
  Workbook, Compact, Premium) with optional answer key; print/save PDF
- **`/community`** — validated bank, awaiting-review queue, returned-to-factory
  queue, contributor standing with hold-up rates

## Stack

Next.js (App Router) · Tailwind v4 · KaTeX for math typesetting ·
Fraunces / Newsreader / Inter. All data is mocked in `lib/data.ts`; builder
state lives in `lib/store.tsx` (localStorage-persisted). No backend — this is
the design prototype for the storefront.

## Run

```bash
npm install
npm run dev
```
