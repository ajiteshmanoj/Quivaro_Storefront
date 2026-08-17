import Link from "next/link";
import { CONTRIBUTORS, DISCORD_URL, NOTES, QUESTIONS } from "@/lib/data";
import { MathText } from "@/components/MathText";
import { GlyphField, Reveal, RotatingWord, Squiggle } from "@/components/motion";

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
  const second = QUESTIONS.find((q) => q.id === "q-fun-01")!;

  return (
    <main>
      {/* ---------- hero ---------- */}
      <section className="hero-glow relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
        <GlyphField />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center md:pt-28">
          <div className="flex flex-col items-center">
            <p className="label !text-[11px] !tracking-[0.22em]">
              build · review · compile · validate
            </p>
            <Squiggle className="mt-2" />
          </div>

          <h1 className="mx-auto mt-8 max-w-4xl font-display text-6xl font-semibold leading-[1.04] tracking-tight text-ink md:text-[5.2rem]">
            Study smarter.
            <br />
            <em className="font-medium italic text-gold">
              Every question validated.
            </em>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-soft">
            Worksheets built from questions real IB teachers approved — sorted
            by subject, topic and level. Swap out anything you don&rsquo;t
            like; a replacement arrives in seconds.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/build"
              className="pop-btn bg-gradient-to-br from-accent to-[#123c2c] px-8 py-3.5 text-[15px] text-paper"
            >
              start building — free →
            </Link>
            <Link
              href="/bank"
              className="text-sm font-bold text-ink underline decoration-gold decoration-2 underline-offset-8 transition-colors hover:text-accent"
            >
              browse the bank →
            </Link>
          </div>

          <p className="mt-10 text-xs font-bold tracking-[0.18em] text-faint">
            BUILT FOR{" "}
            <span className="font-display text-lg font-medium normal-case italic tracking-normal text-gold">
              <RotatingWord
                words={[
                  "IB teachers",
                  "IB students",
                  "tutors",
                  "exam season",
                  "the night before class",
                ]}
              />
            </span>
          </p>
        </div>
      </section>

      {/* ---------- marquee ---------- */}
      <div className="overflow-hidden border-y border-ink/10 bg-accent py-2.5">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span
              key={i}
              className="mx-4 shrink-0 text-sm font-bold lowercase tracking-wide text-paper/90"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- 01 · the bank ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="flex items-center gap-6">
            <span className="label whitespace-nowrap !text-[11px] !tracking-[0.2em]">
              quivaro — the bank
            </span>
            <span className="h-px flex-1 bg-hairline" />
            <span className="q-number">01</span>
          </div>
          <Squiggle className="mt-6" />
        </Reveal>

        <div className="mt-8 grid items-start gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <h2 className="font-display text-5xl font-semibold leading-[1.06] tracking-tight text-ink">
              One bank.
              <br />
              <em className="font-medium italic text-gold">
                Validated by real teachers.
              </em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-soft">
              Every question comes from the factory already sorted — then IB
              teachers vote on what holds up. Flags and rejections go straight
              back for repair. The bank gets sharper the more it&rsquo;s used.
            </p>
            <ul className="mt-8 divide-y divide-hairline border-t border-hairline">
              {[
                ["🗂️", "Sorted", "Subject, topic, sub-topic and level — AA + AI, HL + SL"],
                ["▲", "Voted on", "Teacher votes rank every question; IB Teacher votes weigh most"],
                ["↻", "Self-repairing", "Reject in preview and a replacement arrives in seconds"],
                ["🏷️", "Yours", "Members earn tags — validate questions, shape the bank"],
              ].map(([icon, title, body]) => (
                <li key={title as string} className="flex items-center gap-5 py-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-lg">
                    {icon}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">{title}</p>
                    <p className="text-sm text-soft">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* browser-mockup specimen */}
          <Reveal delay={150}>
            <div className="pop-card overflow-hidden">
              <div className="flex items-center gap-3 border-b border-hairline bg-paper/60 px-5 py-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-hairline-dark" />
                  <span className="h-2.5 w-2.5 rounded-full bg-hairline-dark" />
                  <span className="h-2.5 w-2.5 rounded-full bg-hairline-dark" />
                </span>
                <span className="mx-auto rounded-full border border-hairline bg-white px-4 py-1 text-[11px] text-faint">
                  quivaro.app/bank
                </span>
              </div>
              <div className="space-y-4 p-6">
                <div className="rounded-2xl border border-accent/25 bg-accent-soft/40 p-5">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="label !text-[10px]">Calculus · AA</span>
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-paper">
                      just validated
                    </span>
                  </div>
                  <p className="font-serif text-[15px] leading-relaxed text-ink">
                    <MathText text={featured.text} />
                  </p>
                  <p className="mt-3 text-[11px] font-bold text-accent">
                    ▲ 7 teacher votes
                  </p>
                </div>
                <div className="rounded-2xl border border-hairline bg-white p-5">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="label !text-[10px]">Functions · AA</span>
                    <span className="q-number">[{second.marks}]</span>
                  </div>
                  <p className="font-serif text-[15px] leading-relaxed text-ink">
                    <MathText text={second.text} />
                  </p>
                  <p className="mt-3 text-[11px] font-bold text-accent">
                    ▲ 9 teacher votes
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Calculus", "Vectors", "Stats & Prob", "AA HL", "AI SL"].map(
                    (t) => (
                      <span
                        key={t}
                        className="rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-bold text-gold"
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- 02 · the studio ---------- */}
      <section className="border-t border-hairline bg-sheet/60">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <div className="flex items-center gap-6">
              <span className="label whitespace-nowrap !text-[11px] !tracking-[0.2em]">
                quivaro — the studio
              </span>
              <span className="h-px flex-1 bg-hairline" />
              <span className="q-number">02</span>
            </div>
            <Squiggle className="mt-6" />
          </Reveal>

          <Reveal>
            <h2 className="mt-8 max-w-2xl font-display text-5xl font-semibold leading-[1.06] tracking-tight text-ink">
              Build it your way.
              <br />
              <em className="font-medium italic text-gold">
                Reject. Replace. Compile.
              </em>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "🛠️",
                "Stack your questions",
                "Pull from any topic and level. Drop teacher-written notes between exercises — practice becomes teaching material.",
              ],
              [
                "↻",
                "Reject in preview",
                "Don't like a question? One click and a replacement from the same topic arrives. The reject goes back to the factory.",
              ],
              [
                "🖨️",
                "Compile to paper",
                "Five templates, from formal Examination to ruled Workbook. Answer key optional. Print-ready in one click.",
              ],
            ].map(([icon, title, body], i) => (
              <Reveal key={title as string} delay={i * 120}>
                <div className="pop-card h-full p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-xl">
                    {icon}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 03 · the beta / discord ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="flex items-center gap-6">
            <span className="label whitespace-nowrap !text-[11px] !tracking-[0.2em]">
              quivaro — the beta
            </span>
            <span className="h-px flex-1 bg-hairline" />
            <span className="q-number">03</span>
          </div>
          <Squiggle className="mt-6" />
        </Reveal>

        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h2 className="font-display text-5xl font-semibold leading-[1.06] tracking-tight text-ink">
              Invite-only,
              <br />
              <em className="font-medium italic text-gold">for now.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-soft">
              No accounts, no passwords — entry is by token. A small batch
              drops in the Discord every day, and we issue them directly to IB
              teachers and school administrators on LinkedIn. Beta testers who
              shape the product keep the{" "}
              <span className="font-bold text-gold">Founding member</span> tag
              forever.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="pop-btn bg-[#5865F2] px-7 py-3 text-sm text-white shadow-[0_6px_18px_-6px_rgba(88,101,242,0.55)]"
              >
                join the Discord →
              </a>
              <Link
                href="/beta"
                className="text-sm font-bold text-ink underline decoration-gold decoration-2 underline-offset-8 transition-colors hover:text-accent"
              >
                got a token? →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="pop-card p-7">
              <p className="label !text-[10px]">today&rsquo;s drop</p>
              <div className="mt-4 space-y-2.5">
                {["QVR-•••••", "QVR-•••••", "QVR-•••••"].map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-hairline bg-paper/70 px-4 py-3"
                  >
                    <span className="font-display text-lg font-semibold tracking-widest text-ink">
                      {c}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        i < 2
                          ? "bg-hairline text-soft"
                          : "bg-accent text-paper"
                      }`}
                    >
                      {i < 2 ? "claimed" : "up for grabs"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-[11px] text-faint">
                5 tokens a day · issued in Discord &amp; over LinkedIn
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- numbers ---------- */}
      <section className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-5 px-6 py-16">
          {[
            [String(QUESTIONS.length), "questions in the bank"],
            [String(validated), "teacher-validated"],
            [String(NOTES.length), "notes chunks"],
            [String(totalApprovals), "votes cast"],
          ].map(([n, l], i) => (
            <Reveal key={l} delay={i * 90}>
              <div className="sticker px-6 py-3 text-center">
                <span className="font-display text-2xl font-semibold tabular-nums text-accent">
                  {n}
                </span>
                <span className="ml-2 text-xs font-semibold lowercase text-soft">
                  {l}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
