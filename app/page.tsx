import Link from "next/link";
import { CONTRIBUTORS, DISCORD_URL, NOTES, QUESTIONS } from "@/lib/data";
import { MathText } from "@/components/MathText";

const MARQUEE = [
  "calculus",
  "✦",
  "vectors",
  "✦",
  "complex numbers",
  "✦",
  "teacher approved",
  "✦",
  "quality-checked",
  "✦",
  "stats & prob",
  "✦",
  "100% free during early access",
  "✦",
  "AA + AI · HL + SL",
  "✦",
];

export default function Home() {
  const validated = QUESTIONS.filter((q) => q.status === "validated").length;
  const totalApprovals = CONTRIBUTORS.reduce((s, c) => s + c.approvals, 0);
  const featured = QUESTIONS.find((q) => q.id === "q-cal-01")!;

  return (
    <main>
      {/* hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 text-center md:pt-24">
        <p className="mx-auto mb-6 inline-block rounded-full border-2 border-ink bg-gold-soft px-4 py-1.5 text-xs font-bold tracking-wide text-ink">
          IB MATH AA + AI · HL + SL
        </p>
        <h1 className="mx-auto max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl">
          study smarter with{" "}
          <span className="hl-gold whitespace-nowrap">Quivaro</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-soft">
          Worksheets from questions real IB teachers approved. Swap out any
          question you don&rsquo;t like — a replacement shows up in seconds.
          Print something that looks proper.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/build"
            className="pop-btn bg-accent px-7 py-3 text-sm text-paper"
          >
            start building →
          </Link>
          <Link
            href="/bank"
            className="pop-btn bg-sheet px-7 py-3 text-sm text-ink"
          >
            browse the bank
          </Link>
        </div>
        <p className="mt-7 text-xs font-medium text-faint">
          Free for beta testers — worked solutions included. Get in early and keep the{" "}
          <span className="font-bold text-gold">Founding member</span> tag forever ✨
        </p>

        {/* specimen */}
        <div className="mx-auto mt-14 max-w-xl text-left">
          <div className="pop-card relative p-7">
            <span className="sticker absolute -top-3.5 right-6 bg-accent px-3 py-1 text-[11px] text-paper">
              ✓ teacher approved
            </span>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="q-number">01</span>
              <span className="q-number">[{featured.marks}]</span>
            </div>
            <p className="font-serif text-[16px] leading-relaxed text-ink">
              <MathText text={featured.text} />
            </p>
            <div className="mt-5 flex items-center justify-between border-t-2 border-ink/10 pt-4">
              <span className="text-[12px] font-bold text-accent">
                ▲ 7 teacher votes
              </span>
              <span className="text-[11px] font-medium text-faint">
                Calculus · AA
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* marquee */}
      <div className="overflow-hidden border-y-2 border-ink bg-accent py-2.5">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span
              key={i}
              className="mx-4 shrink-0 text-sm font-bold lowercase tracking-wide text-paper"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* the three pillars */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
        {[
          {
            href: "/bank",
            emoji: "🏦",
            title: "the bank",
            body: "Every question sorted by subject, topic and level — ranked by member votes. Browse, vote, flag, add.",
            tilt: "",
          },
          {
            href: "/build",
            emoji: "🛠️",
            title: "the studio",
            body: "Stack questions, drop notes between them, pick a paper template, hit compile. Done before class starts.",
            tilt: "",
          },
          {
            href: "/beta",
            emoji: "🎟️",
            title: "the beta",
            body: "No accounts — entry is by invite token. A few drop every day in the Discord, and we issue them directly to teachers on LinkedIn.",
            tilt: "",
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="pop-card p-7"
          >
            <span className="text-3xl">{c.emoji}</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink">
              {c.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-soft">{c.body}</p>
          </Link>
        ))}
      </section>

      {/* discord */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="pop-card flex flex-col items-center gap-5 p-8 text-center md:flex-row md:text-left">
          <span className="text-4xl">📣</span>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-ink">
              the beta lives on Discord
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-soft">
              Feedback threads shape what gets built each week. Worksheet
              showcases, syllabus talk, and a small batch of invite tokens
              every day. Teachers who help shape the beta keep the{" "}
              <span className="font-bold text-gold">Founding member</span> tag
              forever.
            </p>
          </div>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pop-btn shrink-0 bg-[#5865F2] px-6 py-3 text-sm text-white"
          >
            join the Discord →
          </a>
        </div>
      </section>

      {/* numbers */}
      <section className="mx-auto flex max-w-6xl flex-wrap justify-center gap-5 px-6 pb-16">
        {[
          [String(QUESTIONS.length), "questions in the bank"],
          [String(validated), "teacher-validated"],
          [String(NOTES.length), "notes chunks"],
          [String(totalApprovals), "votes cast"],
        ].map(([n, l]) => (
          <div
            key={l}
            className="sticker bg-sheet px-6 py-3 text-center"
          >
            <span className="font-display text-2xl font-bold tabular-nums text-accent">
              {n}
            </span>
            <span className="ml-2 text-xs font-semibold lowercase text-soft">
              {l}
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
