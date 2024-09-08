import type { Metadata, Viewport } from "next";
import { Source_Sans_3 } from "next/font/google";

import "./globals.css";
import { Logo } from "./components/Logo";
import Link from "next/link";
import { format } from "date-fns";
import Icon from "@mdi/react";
import { mdiGithub, mdiLink } from "@mdi/js";

const source_sans = Source_Sans_3({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ÆSIR Assets",
  description:
    "Assets and graphical design for ÆSIR - Association of Engineering Students in Rocketry",
};

export const viewport: Viewport = {
  themeColor: "#37109F",
};

const now = new Date();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${source_sans.className} h-full`}>
      <body className="bg-aesir-dark flex flex-col h-full gap-4">
        <nav className="bg-aesir p-4 flex flex-row items-center flex-wrap gap-4">
          <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 items-center">
            <Logo />
            <header className="font-bold text-xl">
              Assets and graphical design
            </header>
          </div>

          <aside className="flex-1 flex justify-end">
            <Link href="https://aesir.se" className="whitespace-nowrap">
              <Icon path={mdiLink} className="w-4 h-4 inline mr-0.5" />
              aesir.se
            </Link>
          </aside>
        </nav>
        <section className="flex-1 p-4">{children}</section>
        <footer className="bg-aesir-medium px-4 py-8 flex flex-col gap-8">
          <p className="text-center">
            Developed by{" "}
            <Link className="underline" href="https://github.com/eweilow">
              <Icon path={mdiGithub} className="w-4 h-4 inline mr-0.5" />
              eweilow
            </Link>{" "}
            for ÆSIR - Association of Engineering Students in Rocketry 🚀
          </p>
          <p className="text-center italic text-white/50">
            Last deployed {format(now, "yyyy-MM-dd")}
          </p>
        </footer>
      </body>
    </html>
  );
}
