import katex from "katex";
import { Fragment } from "react";

type Segment =
  | { type: "text"; value: string }
  | { type: "inline" | "display"; value: string };

function parse(text: string): Segment[] {
  const segments: Segment[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      segments.push({ type: "text", value: text.slice(last, m.index) });
    }
    if (m[1] !== undefined) {
      segments.push({ type: "display", value: m[1] });
    } else {
      segments.push({ type: "inline", value: m[2] });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    segments.push({ type: "text", value: text.slice(last) });
  }
  return segments;
}

/** Renders prose with $inline$ and $$display$$ LaTeX via KaTeX. */
export function MathText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const segments = parse(text);
  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === "text") {
          return <Fragment key={i}>{seg.value}</Fragment>;
        }
        const html = katex.renderToString(seg.value, {
          throwOnError: false,
          displayMode: seg.type === "display",
          strict: false,
        });
        return (
          <span
            key={i}
            className={seg.type === "display" ? "my-3 block text-center" : undefined}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}
