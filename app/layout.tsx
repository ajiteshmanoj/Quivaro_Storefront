import type { Metadata } from "next";
import { Fraunces, Inter, Newsreader } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Nav } from "@/components/Nav";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Quivaro — IB Mathematics worksheet studio",
  description:
    "Build teacher-validated IB Math AA & AI worksheets from a community-approved question bank. Free during early access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${inter.variable}`}
    >
      <body className="min-h-screen antialiased">
        <StoreProvider>
          <Nav />
          {children}
          <footer className="no-print mt-24 border-t border-hairline">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
              <p>
                Quivaro — the IB Mathematics worksheet studio. Free during early
                access; founding contributors keep full access forever.
              </p>
              <p>Math AA HL·SL — Math AI HL·SL</p>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
