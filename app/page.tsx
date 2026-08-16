import Link from "next/link";
import { CONTRIBUTORS, NOTES, QUESTIONS } from "@/lib/data";
import { MathText } from "@/components/MathText";

export default function Home() {
  const validated = QUESTIONS.filter((q) => q.status === "validated").length;
  const totalApprovals = CONTRIBUTORS.reduce((s, c) => s + c.approvals, 0);
  const featured = QUESTIONS.find((q) => q.id === "q-cal-01")!;

  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* hero */}
      <section className="grid gap-12 border-b border-hairline py-20 md:grid-cols-[1.2fr_1fr] md:py-28">
        <div>
          <p className="label mb-6 !text-accent">
            IB Mathematics · AA HL·SL — AI HL·SL
          </p>
          <h1 className="font-display text-5xl font-medium leading-[1.08] tracking-tight text-ink md:text-6xl">
            The worksheet,
            <br />
            <em className="font-light italic text-accent">as it should be.</em>
          </h1>
          <p className="mt-7 max-w-md font-serif text-lg leading-relaxed text-soft">
            Build practice sets and notes-led worksheets from a bank of
            questions validated by practising IB teachers. Reject what you
            don&rsquo;t like — a replacement arrives in seconds. Compile to a
            beautiful PDF.
          </p>
          <div className="mt-9 flex items-center gap-5">
            <Link
              href="/build"
              className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent"
            >
              Start building
            </Link>
            <Link
              href="/bank"
              className="text-sm font-medium text-soft underline decoration-hairline-dark underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
            >
              Browse the bank
            </Link>
          </div>
          <p className="mt-8 text-xs text-faint">
            Everything is free during early access — including worked
            solutions. Founding contributors keep full access forever.
          </p>
        </div>

        {/* featured question, as a specimen */}
        <div className="hidden md:block">
          <div className="rotate-[0.4deg] border border-hairline bg-sheet p-7 shadow-xl shadow-ink/5">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="q-number">01</span>
              <span className="q-number">[{featured.marks}]</span>
            </div>
            <p className="font-serif text-[16px] leading-relaxed text-ink">
              <MathText text={featured.text} />
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-approve">
                ✓ validated by 7 teachers
              </span>
              <span className="text-[11px] text-faint">Calculus · AA</span>
            </div>
          </div>
        </div>
      </section>

      {/* the three rooms */}
      <section className="grid border-b border-hairline md:grid-cols-3">
        {[
          {
            href: "/bank",
            n: "I",
            title: "The Bank",
            body: "Every question in the syllabus areas you teach, ranked by teacher validation. Browse, filter, approve, flag.",
          },
          {
            href: "/build",
            n: "II",
            title: "The Studio",
            body: "Assemble a worksheet, reject questions in preview, interleave notes between exercises, choose a paper template.",
          },
          {
            href: "/community",
            n: "III",
            title: "The Community",
            body: "Practising IB teachers validate every question. Rejections return to the factory. The bank gets better as it is used.",
          },
        ].map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group py-12 pr-8 transition-colors hover:bg-sheet md:px-8 ${
              i > 0 ? "border-t border-hairline md:border-l md:border-t-0" : ""
            }`}
          >
            <p className="font-display text-sm italic text-faint">{c.n}</p>
            <h2 className="mt-2 font-display text-2xl font-medium text-ink group-hover:text-accent">
              {c.title}
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-soft">
              {c.body}
            </p>
          </Link>
        ))}
      </section>

      {/* numbers */}
      <section className="flex flex-wrap gap-x-16 gap-y-8 py-14">
        {[
          [String(QUESTIONS.length), "questions in the bank"],
          [String(validated), "teacher-validated"],
          [String(NOTES.length), "notes chunks"],
          [String(totalApprovals), "approvals by contributors"],
        ].map(([n, l]) => (
          <div key={l}>
            <p className="font-display text-4xl font-light tabular-nums text-ink">
              {n}
            </p>
            <p className="label mt-1.5">{l}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
