export type Level = "AA HL" | "AA SL" | "AI HL" | "AI SL";

export type Topic =
  | "Number & Algebra"
  | "Functions"
  | "Geometry & Trigonometry"
  | "Statistics & Probability"
  | "Calculus";

export type QuestionStatus = "validated" | "unreviewed" | "flagged";

export type FlagReason =
  | "Wrong answer"
  | "Out of syllabus"
  | "Wrong level"
  | "Ambiguous wording";

export interface Question {
  id: string;
  topic: Topic;
  subtopic: string;
  levels: Level[];
  marks: number;
  calculator: boolean;
  text: string;
  answer: string;
  validations: number;
  status: QuestionStatus;
  flagReason?: FlagReason;
}

export interface NoteChunk {
  id: string;
  topic: Topic;
  title: string;
  body: string;
  validations: number;
}

export interface BetaToken {
  code: string;
  /** who this token was issued to, via LinkedIn outreach — blank until issued */
  issuedTo: string;
  roleTag: string;
}

/**
 * Manus-style drip: a handful of codes issued per day, via LinkedIn DMs to IB
 * teachers/admins and drops in the Discord. No accounts, no passwords — the
 * token IS the entry. (Prototype: validated client-side; real version checks
 * server-side and burns single-use codes.)
 */
export const BETA_TOKENS: BetaToken[] = [
  { code: "QVR-EULER", issuedTo: "", roleTag: "IB Teacher" },
  { code: "QVR-GAUSS", issuedTo: "", roleTag: "IB Teacher" },
  { code: "QVR-NEWTON", issuedTo: "", roleTag: "Teacher" },
  { code: "QVR-FERMAT", issuedTo: "", roleTag: "Tutor" },
  { code: "QVR-NOETHER", issuedTo: "", roleTag: "Student" },
  { code: "QVR-MINDLAB", issuedTo: "Matthew Lee", roleTag: "Admin" },
];

export const DISCORD_URL = "https://discord.gg/quivaro"; // TODO: real invite

export interface Contributor {
  name: string;
  school: string;
  approvals: number;
  accuracy: number;
  founding: boolean;
}

export const TOPICS: Topic[] = [
  "Number & Algebra",
  "Functions",
  "Geometry & Trigonometry",
  "Statistics & Probability",
  "Calculus",
];

export const LEVELS: Level[] = ["AA HL", "AA SL", "AI HL", "AI SL"];

export const FLAG_REASONS: FlagReason[] = [
  "Wrong answer",
  "Out of syllabus",
  "Wrong level",
  "Ambiguous wording",
];

export const QUESTIONS: Question[] = [
  // ---------------- Calculus ----------------
  {
    id: "q-cal-01",
    topic: "Calculus",
    subtopic: "Differentiation — product rule",
    levels: ["AA HL", "AA SL"],
    marks: 4,
    calculator: false,
    text: String.raw`Let $f(x) = x^3 \ln x$, for $x > 0$. Find $f'(x)$, giving your answer in the form $x^2(a\ln x + b)$ where $a, b \in \mathbb{Z}$.`,
    answer: String.raw`By the product rule, $f'(x) = 3x^2 \ln x + x^3 \cdot \frac{1}{x} = 3x^2\ln x + x^2 = x^2(3\ln x + 1)$, so $a = 3$, $b = 1$.`,
    validations: 7,
    status: "validated",
  },
  {
    id: "q-cal-02",
    topic: "Calculus",
    subtopic: "Integration by parts",
    levels: ["AA HL"],
    marks: 6,
    calculator: false,
    text: String.raw`Using integration by parts, show that $\int_0^{\pi} x \sin x \, \mathrm{d}x = \pi$.`,
    answer: String.raw`Take $u = x$, $\mathrm{d}v = \sin x\,\mathrm{d}x$, so $\mathrm{d}u = \mathrm{d}x$, $v = -\cos x$. Then $\int_0^{\pi} x\sin x\,\mathrm{d}x = \left[-x\cos x\right]_0^{\pi} + \int_0^{\pi}\cos x\,\mathrm{d}x = \pi + \left[\sin x\right]_0^{\pi} = \pi$.`,
    validations: 5,
    status: "validated",
  },
  {
    id: "q-cal-03",
    topic: "Calculus",
    subtopic: "Stationary points",
    levels: ["AA HL", "AA SL", "AI HL"],
    marks: 7,
    calculator: false,
    text: String.raw`The curve $C$ has equation $y = \dfrac{2x}{x^2 + 1}$. Find the coordinates of the stationary points of $C$ and determine their nature.`,
    answer: String.raw`$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{2(x^2+1) - 2x(2x)}{(x^2+1)^2} = \frac{2(1 - x^2)}{(x^2+1)^2}$. Setting this to zero gives $x = \pm 1$: a maximum at $(1, 1)$ and a minimum at $(-1, -1)$, by the sign change of the derivative.`,
    validations: 6,
    status: "validated",
  },
  {
    id: "q-cal-04",
    topic: "Calculus",
    subtopic: "Kinematics",
    levels: ["AA SL", "AI SL", "AI HL"],
    marks: 5,
    calculator: true,
    text: String.raw`A particle moves in a straight line with velocity $v(t) = 6t^2 - 4t + 1$ m s$^{-1}$, for $t \ge 0$ seconds. Find the displacement of the particle between $t = 1$ and $t = 3$.`,
    answer: String.raw`Displacement $= \int_1^3 (6t^2 - 4t + 1)\,\mathrm{d}t = \left[2t^3 - 2t^2 + t\right]_1^3 = (54 - 18 + 3) - (2 - 2 + 1) = 38$ m.`,
    validations: 4,
    status: "validated",
  },
  {
    id: "q-cal-05",
    topic: "Calculus",
    subtopic: "Limits — Maclaurin",
    levels: ["AA HL"],
    marks: 3,
    calculator: false,
    text: String.raw`Using the Maclaurin series for $\sin x$, or otherwise, evaluate $\displaystyle\lim_{x \to 0} \frac{\sin 3x}{5x}$.`,
    answer: String.raw`$\sin 3x = 3x - \frac{(3x)^3}{3!} + \cdots$, so $\frac{\sin 3x}{5x} = \frac{3}{5} - \frac{27x^2}{30} + \cdots \to \frac{3}{5}$ as $x \to 0$.`,
    validations: 3,
    status: "validated",
  },
  {
    id: "q-cal-06",
    topic: "Calculus",
    subtopic: "Differential equations",
    levels: ["AA HL"],
    marks: 6,
    calculator: false,
    text: String.raw`Solve the differential equation $\dfrac{\mathrm{d}y}{\mathrm{d}x} = y \tan x$, given that $y = 2$ when $x = 0$. Give your answer in the form $y = f(x)$.`,
    answer: String.raw`Separating variables: $\int \frac{1}{y}\,\mathrm{d}y = \int \tan x\,\mathrm{d}x$, so $\ln|y| = \ln|\sec x| + c$. With $y(0) = 2$, $c = \ln 2$, giving $y = 2\sec x$.`,
    validations: 2,
    status: "unreviewed",
  },
  {
    id: "q-cal-07",
    topic: "Calculus",
    subtopic: "Volumes of revolution",
    levels: ["AA HL", "AA SL"],
    marks: 5,
    calculator: false,
    text: String.raw`The region enclosed by the curve $y = \sqrt{x}$, the $x$-axis and the line $x = 4$ is rotated through $2\pi$ radians about the $x$-axis. Find the exact volume of the solid generated.`,
    answer: String.raw`$V = \pi \int_0^4 (\sqrt{x})^2 \,\mathrm{d}x = \pi \int_0^4 x \,\mathrm{d}x = \pi\left[\frac{x^2}{2}\right]_0^4 = 8\pi$.`,
    validations: 8,
    status: "validated",
  },
  {
    id: "q-cal-08",
    topic: "Calculus",
    subtopic: "Related rates",
    levels: ["AA HL"],
    marks: 7,
    calculator: true,
    text: String.raw`Water drains from an inverted cone of semi-vertical angle $30^\circ$ at a constant rate of $2$ cm$^3$ s$^{-1}$. Find the rate at which the depth $h$ is decreasing when $h = 6$ cm.`,
    answer: String.raw`With $r = h\tan 30^\circ$, $V = \frac{\pi}{3}r^2 h = \frac{\pi h^3}{9}$. Then $\frac{\mathrm{d}V}{\mathrm{d}t} = \frac{\pi h^2}{3}\frac{\mathrm{d}h}{\mathrm{d}t}$, so $\frac{\mathrm{d}h}{\mathrm{d}t} = \frac{-2 \cdot 3}{\pi \cdot 36} = -\frac{1}{6\pi}$ cm s$^{-1}$.`,
    validations: 1,
    status: "flagged",
    flagReason: "Wrong answer",
  },

  // ---------------- Number & Algebra ----------------
  {
    id: "q-alg-01",
    topic: "Number & Algebra",
    subtopic: "Arithmetic sequences",
    levels: ["AA SL", "AI SL", "AI HL"],
    marks: 6,
    calculator: true,
    text: String.raw`In an arithmetic sequence, $u_3 = 11$ and $u_8 = 31$. Find the common difference $d$ and the first term $u_1$, and hence find the sum of the first $20$ terms.`,
    answer: String.raw`$u_8 - u_3 = 5d = 20 \Rightarrow d = 4$, so $u_1 = 11 - 2(4) = 3$. Then $S_{20} = \frac{20}{2}\left(2(3) + 19(4)\right) = 10 \times 82 = 820$.`,
    validations: 9,
    status: "validated",
  },
  {
    id: "q-alg-02",
    topic: "Number & Algebra",
    subtopic: "Binomial theorem",
    levels: ["AA HL", "AA SL"],
    marks: 5,
    calculator: false,
    text: String.raw`Find the coefficient of $x^4$ in the expansion of $(3x - 2)^7$.`,
    answer: String.raw`The general term is $\binom{7}{k}(3x)^{7-k}(-2)^k$. For $x^4$, $k = 3$: $\binom{7}{3} \cdot 3^4 \cdot (-2)^3 = 35 \cdot 81 \cdot (-8) = -22\,680$.`,
    validations: 6,
    status: "validated",
  },
  {
    id: "q-alg-03",
    topic: "Number & Algebra",
    subtopic: "Geometric series",
    levels: ["AA SL", "AA HL", "AI HL"],
    marks: 6,
    calculator: false,
    text: String.raw`A geometric series has sum to infinity $27$ and second term $6$. Find the two possible values of the common ratio $r$.`,
    answer: String.raw`$\frac{u_1}{1-r} = 27$ and $u_1 r = 6$. Substituting $u_1 = 27(1-r)$: $27r(1-r) = 6$, so $9r^2 - 9r + 2 = 0$, giving $r = \frac{1}{3}$ or $r = \frac{2}{3}$.`,
    validations: 5,
    status: "validated",
  },
  {
    id: "q-alg-04",
    topic: "Number & Algebra",
    subtopic: "Complex numbers",
    levels: ["AA HL"],
    marks: 6,
    calculator: false,
    text: String.raw`Let $z = 1 + \mathrm{i}\sqrt{3}$. Write $z$ in modulus–argument form, and hence find $z^5$ in Cartesian form.`,
    answer: String.raw`$|z| = 2$, $\arg z = \frac{\pi}{3}$, so $z = 2\,\mathrm{cis}\frac{\pi}{3}$. By de Moivre, $z^5 = 32\,\mathrm{cis}\frac{5\pi}{3} = 32\left(\frac{1}{2} - \mathrm{i}\frac{\sqrt{3}}{2}\right) = 16 - 16\sqrt{3}\,\mathrm{i}$.`,
    validations: 7,
    status: "validated",
  },
  {
    id: "q-alg-05",
    topic: "Number & Algebra",
    subtopic: "Exponents & logarithms",
    levels: ["AA SL", "AA HL"],
    marks: 5,
    calculator: false,
    text: String.raw`Solve the equation $2^{x+1} = 5^{x-2}$, giving your answer in the form $x = \dfrac{\ln a}{\ln b}$ where $a, b \in \mathbb{Q}^+$.`,
    answer: String.raw`Taking logarithms: $(x+1)\ln 2 = (x-2)\ln 5$, so $x(\ln 2 - \ln 5) = -2\ln 5 - \ln 2$, giving $x = \frac{\ln 50}{\ln(5/2)}$.`,
    validations: 2,
    status: "unreviewed",
  },
  {
    id: "q-alg-06",
    topic: "Number & Algebra",
    subtopic: "Financial mathematics",
    levels: ["AI SL", "AI HL"],
    marks: 4,
    calculator: true,
    text: String.raw`Priya invests 5000 USD in an account paying $3.2\%$ annual interest, compounded quarterly. Find the value of the investment after $6$ years, giving your answer to two decimal places.`,
    answer: String.raw`$5000\left(1 + \frac{0.032}{4}\right)^{24} = 5000(1.008)^{24} \approx 6054.72$ USD.`,
    validations: 8,
    status: "validated",
  },

  // ---------------- Functions ----------------
  {
    id: "q-fun-01",
    topic: "Functions",
    subtopic: "Inverse functions",
    levels: ["AA SL", "AA HL"],
    marks: 5,
    calculator: false,
    text: String.raw`The function $f$ is defined by $f(x) = \mathrm{e}^{2x} - 3$, for $x \in \mathbb{R}$. Find $f^{-1}(x)$ and state its domain.`,
    answer: String.raw`Let $y = \mathrm{e}^{2x} - 3$, so $x = \frac{1}{2}\ln(y+3)$. Hence $f^{-1}(x) = \frac{1}{2}\ln(x+3)$, with domain $x > -3$.`,
    validations: 9,
    status: "validated",
  },
  {
    id: "q-fun-02",
    topic: "Functions",
    subtopic: "Discriminant",
    levels: ["AA SL", "AA HL"],
    marks: 6,
    calculator: false,
    text: String.raw`The equation $kx^2 + 4x + (k - 3) = 0$ has two distinct real roots. Find the set of possible values of $k$, where $k \neq 0$.`,
    answer: String.raw`Require $\Delta = 16 - 4k(k-3) > 0$, i.e. $k^2 - 3k - 4 < 0$, so $(k-4)(k+1) < 0$, giving $-1 < k < 4$, $k \neq 0$.`,
    validations: 6,
    status: "validated",
  },
  {
    id: "q-fun-03",
    topic: "Functions",
    subtopic: "Transformations",
    levels: ["AA SL", "AI SL"],
    marks: 4,
    calculator: false,
    text: String.raw`The graph of $y = g(x)$ is obtained from the graph of $y = f(x)$ by the transformation $g(x) = 2f(x - 1) + 3$. Describe fully the sequence of transformations.`,
    answer: String.raw`A translation of $1$ unit in the positive $x$-direction, followed by a vertical stretch of scale factor $2$, followed by a translation of $3$ units in the positive $y$-direction.`,
    validations: 4,
    status: "validated",
  },
  {
    id: "q-fun-04",
    topic: "Functions",
    subtopic: "Rational functions",
    levels: ["AA SL", "AI HL"],
    marks: 5,
    calculator: false,
    text: String.raw`The function $h$ is defined by $h(x) = \dfrac{3x - 1}{x + 2}$, $x \neq -2$. Write down the equations of the asymptotes of the graph of $y = h(x)$, and find the coordinates of the intercepts with the axes.`,
    answer: String.raw`Vertical asymptote $x = -2$; horizontal asymptote $y = 3$. Intercepts: $\left(\frac{1}{3}, 0\right)$ and $\left(0, -\frac{1}{2}\right)$.`,
    validations: 3,
    status: "unreviewed",
  },
  {
    id: "q-fun-05",
    topic: "Functions",
    subtopic: "Composite functions",
    levels: ["AA HL"],
    marks: 5,
    calculator: false,
    text: String.raw`Let $f(x) = \dfrac{1}{1 - x}$ for $x \neq 1$. Show that $(f \circ f \circ f)(x) = x$, stating any values of $x$ that must be excluded.`,
    answer: String.raw`$(f \circ f)(x) = \frac{1}{1 - \frac{1}{1-x}} = \frac{x-1}{x} = 1 - \frac{1}{x}$. Then $f\left(1 - \frac{1}{x}\right) = \frac{1}{1/x} = x$, excluding $x = 0$ and $x = 1$.`,
    validations: 5,
    status: "validated",
  },

  // ---------------- Geometry & Trigonometry ----------------
  {
    id: "q-trig-01",
    topic: "Geometry & Trigonometry",
    subtopic: "Cosine rule & area",
    levels: ["AA SL", "AI SL", "AI HL"],
    marks: 6,
    calculator: true,
    text: String.raw`In triangle $ABC$, $AB = 8$ cm, $AC = 11$ cm and $\hat{A} = 37^\circ$. Find the length $BC$ and the area of the triangle.`,
    answer: String.raw`$BC^2 = 8^2 + 11^2 - 2(8)(11)\cos 37^\circ \approx 44.44$, so $BC \approx 6.67$ cm. Area $= \frac{1}{2}(8)(11)\sin 37^\circ \approx 26.5$ cm$^2$.`,
    validations: 7,
    status: "validated",
  },
  {
    id: "q-trig-02",
    topic: "Geometry & Trigonometry",
    subtopic: "Trigonometric equations",
    levels: ["AA SL", "AA HL"],
    marks: 7,
    calculator: false,
    text: String.raw`Solve $2\sin^2 x - \cos x - 1 = 0$ for $0 \le x \le 2\pi$.`,
    answer: String.raw`Using $\sin^2 x = 1 - \cos^2 x$: $2\cos^2 x + \cos x - 1 = 0$, so $(2\cos x - 1)(\cos x + 1) = 0$. Hence $\cos x = \frac{1}{2}$ or $\cos x = -1$, giving $x = \frac{\pi}{3}, \pi, \frac{5\pi}{3}$.`,
    validations: 8,
    status: "validated",
  },
  {
    id: "q-trig-03",
    topic: "Geometry & Trigonometry",
    subtopic: "Identities",
    levels: ["AA HL", "AA SL"],
    marks: 4,
    calculator: false,
    text: String.raw`Prove that $\dfrac{\sin 2\theta}{1 + \cos 2\theta} = \tan\theta$, for values of $\theta$ where both sides are defined.`,
    answer: String.raw`$\frac{\sin 2\theta}{1 + \cos 2\theta} = \frac{2\sin\theta\cos\theta}{2\cos^2\theta} = \frac{\sin\theta}{\cos\theta} = \tan\theta$.`,
    validations: 5,
    status: "validated",
  },
  {
    id: "q-trig-04",
    topic: "Geometry & Trigonometry",
    subtopic: "Arcs & sectors",
    levels: ["AA SL", "AI SL"],
    marks: 4,
    calculator: true,
    text: String.raw`A sector of a circle has radius $6$ cm and angle $1.2$ radians. Find the perimeter and the area of the sector.`,
    answer: String.raw`Arc length $= 6 \times 1.2 = 7.2$ cm, so perimeter $= 7.2 + 12 = 19.2$ cm. Area $= \frac{1}{2}(6^2)(1.2) = 21.6$ cm$^2$.`,
    validations: 6,
    status: "validated",
  },
  {
    id: "q-trig-05",
    topic: "Geometry & Trigonometry",
    subtopic: "Bearings",
    levels: ["AI SL", "AI HL"],
    marks: 6,
    calculator: true,
    text: String.raw`A ship sails from port $P$ on a bearing of $065^\circ$ for $12$ km to point $Q$, then on a bearing of $155^\circ$ for $9$ km to point $R$. Find the distance $PR$ and the bearing of $R$ from $P$.`,
    answer: String.raw`$\hat{PQR} = 90^\circ$, so $PR = \sqrt{12^2 + 9^2} = 15$ km. The bearing of $R$ from $P$ is $065^\circ + \arctan\frac{9}{12} \approx 065^\circ + 36.9^\circ = 101.9^\circ \approx 102^\circ$.`,
    validations: 0,
    status: "unreviewed",
  },
  {
    id: "q-trig-06",
    topic: "Geometry & Trigonometry",
    subtopic: "Vectors",
    levels: ["AA HL"],
    marks: 6,
    calculator: false,
    text: String.raw`The lines $L_1: \mathbf{r} = \begin{pmatrix}1\\2\\0\end{pmatrix} + \lambda\begin{pmatrix}2\\-1\\1\end{pmatrix}$ and $L_2: \mathbf{r} = \begin{pmatrix}3\\0\\2\end{pmatrix} + \mu\begin{pmatrix}1\\1\\-1\end{pmatrix}$ are given. Determine whether $L_1$ and $L_2$ intersect, and if so find the point of intersection.`,
    answer: String.raw`Equating components: $1 + 2\lambda = 3 + \mu$, $2 - \lambda = \mu$, $\lambda = 2 - \mu$. From the second and third, $\lambda = 1$, $\mu = 1$; checking the first: $3 = 4$ — inconsistent, so the lines do not intersect (they are skew).`,
    validations: 1,
    status: "flagged",
    flagReason: "Ambiguous wording",
  },

  // ---------------- Statistics & Probability ----------------
  {
    id: "q-stat-01",
    topic: "Statistics & Probability",
    subtopic: "Normal distribution",
    levels: ["AA SL", "AI SL", "AI HL"],
    marks: 6,
    calculator: true,
    text: String.raw`The heights of students are normally distributed with mean $168$ cm and standard deviation $5$ cm. Find the probability that a randomly chosen student is taller than $175$ cm, and the height $k$ such that $90\%$ of students are shorter than $k$.`,
    answer: String.raw`$P(X > 175) = P\left(Z > 1.4\right) \approx 0.0808$. For the $90$th percentile, $z = 1.2816$, so $k = 168 + 1.2816 \times 5 \approx 174.4$ cm.`,
    validations: 10,
    status: "validated",
  },
  {
    id: "q-stat-02",
    topic: "Statistics & Probability",
    subtopic: "Binomial distribution",
    levels: ["AA SL", "AI SL"],
    marks: 5,
    calculator: true,
    text: String.raw`A biased coin shows heads with probability $0.35$. The coin is tossed $12$ times. Find $P(X = 4)$ and $P(X \ge 2)$, where $X$ is the number of heads.`,
    answer: String.raw`$P(X=4) = \binom{12}{4}(0.35)^4(0.65)^8 \approx 0.235$. $P(X \ge 2) = 1 - P(X=0) - P(X=1) \approx 1 - 0.00569 - 0.0368 = 0.957$.`,
    validations: 7,
    status: "validated",
  },
  {
    id: "q-stat-03",
    topic: "Statistics & Probability",
    subtopic: "Conditional probability",
    levels: ["AA SL", "AA HL", "AI HL"],
    marks: 5,
    calculator: false,
    text: String.raw`A bag contains $5$ red and $3$ blue counters. Two counters are drawn at random without replacement. Given that the first counter is blue, find the probability that the second is red. Hence find the probability that exactly one of the two counters is red.`,
    answer: String.raw`$P(\text{2nd red} \mid \text{1st blue}) = \frac{5}{7}$. $P(\text{exactly one red}) = \frac{5}{8}\cdot\frac{3}{7} + \frac{3}{8}\cdot\frac{5}{7} = \frac{30}{56} = \frac{15}{28}$.`,
    validations: 6,
    status: "validated",
  },
  {
    id: "q-stat-04",
    topic: "Statistics & Probability",
    subtopic: "Regression",
    levels: ["AI SL", "AI HL"],
    marks: 6,
    calculator: true,
    text: String.raw`A researcher records revision hours $x$ and test scores $y$ for eight students, obtaining $r = 0.94$ and the regression line $y = 5.8x + 32$. Interpret the value of $r$, estimate the score of a student who revises for $6$ hours, and explain why the line should not be used for $x = 20$.`,
    answer: String.raw`$r = 0.94$ indicates a strong positive linear correlation. For $x = 6$: $y = 5.8(6) + 32 \approx 67$. Using $x = 20$ would be extrapolation far outside the data range, so the estimate would be unreliable.`,
    validations: 4,
    status: "validated",
  },
  {
    id: "q-stat-05",
    topic: "Statistics & Probability",
    subtopic: "Chi-squared test",
    levels: ["AI SL", "AI HL"],
    marks: 6,
    calculator: true,
    text: String.raw`A school tests whether choice of science subject is independent of year group, using a $\chi^2$ test at the $5\%$ significance level on a $3 \times 2$ contingency table. The test statistic is $\chi^2_{calc} = 7.31$. Write down the number of degrees of freedom, the critical value $5.991$ comparison, and the conclusion of the test.`,
    answer: String.raw`Degrees of freedom $= (3-1)(2-1) = 2$. Since $7.31 > 5.991$, reject $H_0$: there is sufficient evidence at the $5\%$ level that subject choice is not independent of year group.`,
    validations: 3,
    status: "unreviewed",
  },
];

export const NOTES: NoteChunk[] = [
  {
    id: "n-01",
    topic: "Calculus",
    title: "Integration by parts",
    body: String.raw`For differentiable functions $u$ and $v$: $$\int u \,\frac{\mathrm{d}v}{\mathrm{d}x}\,\mathrm{d}x = uv - \int v \,\frac{\mathrm{d}u}{\mathrm{d}x}\,\mathrm{d}x$$ Choose $u$ by LIATE: Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential — differentiate the one that appears first.`,
    validations: 6,
  },
  {
    id: "n-02",
    topic: "Calculus",
    title: "The chain rule",
    body: String.raw`If $y = g(u)$ and $u = f(x)$, then $$\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{\mathrm{d}y}{\mathrm{d}u}\cdot\frac{\mathrm{d}u}{\mathrm{d}x}$$ Differentiate the outer function, keep the inner function, multiply by the derivative of the inner. Example: $\frac{\mathrm{d}}{\mathrm{d}x}\sin(x^2) = 2x\cos(x^2)$.`,
    validations: 8,
  },
  {
    id: "n-03",
    topic: "Functions",
    title: "The discriminant",
    body: String.raw`For $ax^2 + bx + c = 0$, the discriminant is $\Delta = b^2 - 4ac$. If $\Delta > 0$: two distinct real roots. If $\Delta = 0$: one repeated real root. If $\Delta < 0$: no real roots. The condition "two distinct real roots" translates directly to $\Delta > 0$.`,
    validations: 7,
  },
  {
    id: "n-04",
    topic: "Geometry & Trigonometry",
    title: "Sine and cosine rules",
    body: String.raw`Sine rule: $\dfrac{a}{\sin A} = \dfrac{b}{\sin B} = \dfrac{c}{\sin C}$ — use with a known angle–opposite-side pair. Cosine rule: $a^2 = b^2 + c^2 - 2bc\cos A$ — use with two sides and the included angle, or all three sides. Area of a triangle: $\frac{1}{2}ab\sin C$.`,
    validations: 9,
  },
  {
    id: "n-05",
    topic: "Statistics & Probability",
    title: "Standardising the normal distribution",
    body: String.raw`If $X \sim N(\mu, \sigma^2)$, then $Z = \dfrac{X - \mu}{\sigma} \sim N(0, 1)$. Standardise to compare values from different distributions or to use inverse-normal lookups: a value $x$ lies $z$ standard deviations from the mean.`,
    validations: 5,
  },
  {
    id: "n-06",
    topic: "Number & Algebra",
    title: "Geometric series",
    body: String.raw`For first term $u_1$ and common ratio $r$: $$S_n = \frac{u_1(1 - r^n)}{1 - r}, \qquad S_\infty = \frac{u_1}{1 - r} \text{ for } |r| < 1$$ The sum to infinity exists only when $|r| < 1$ — always state this condition when using it.`,
    validations: 6,
  },
  {
    id: "n-07",
    topic: "Number & Algebra",
    title: "Laws of logarithms",
    body: String.raw`$\log_a xy = \log_a x + \log_a y$; $\quad \log_a \frac{x}{y} = \log_a x - \log_a y$; $\quad \log_a x^n = n\log_a x$. Change of base: $\log_a x = \dfrac{\ln x}{\ln a}$. These hold for $x, y > 0$.`,
    validations: 4,
  },
  {
    id: "n-08",
    topic: "Number & Algebra",
    title: "Binomial theorem",
    body: String.raw`$$(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k$$ The general term is $\binom{n}{k}a^{n-k}b^k$. To find a specific coefficient, set the power of $x$ in the general term equal to the target and solve for $k$.`,
    validations: 5,
  },
];

export const CONTRIBUTORS: Contributor[] = [
  { name: "S. Nakamura", school: "UWC South East Asia", approvals: 142, accuracy: 98, founding: true },
  { name: "M. Okafor", school: "Tanglin Trust School", approvals: 117, accuracy: 96, founding: true },
  { name: "L. Bergström", school: "Copenhagen International School", approvals: 98, accuracy: 97, founding: true },
  { name: "A. Fernandez", school: "St. Julian's School, Lisbon", approvals: 84, accuracy: 93, founding: true },
  { name: "R. Krishnan", school: "Dulwich College Shanghai", approvals: 71, accuracy: 95, founding: false },
  { name: "J. Whitfield", school: "International School of Geneva", approvals: 56, accuracy: 91, founding: false },
  { name: "H. Tan", school: "ACS (International), Singapore", approvals: 43, accuracy: 94, founding: false },
  { name: "E. Rossi", school: "International School of Kuala Lumpur", approvals: 29, accuracy: 89, founding: false },
];

export const TEMPLATES = [
  {
    id: "examination",
    name: "Examination",
    description: "Formal paper header, marks in the margin",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Textbook spacing and numbered rules",
  },
  {
    id: "workbook",
    name: "Workbook",
    description: "Ruled space for working after each question",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense and ink-saving",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Accent headers with a cover strip",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export function questionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export function noteById(id: string): NoteChunk | undefined {
  return NOTES.find((n) => n.id === id);
}
