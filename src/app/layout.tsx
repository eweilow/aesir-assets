import type { Metadata } from "next";
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

const now = new Date();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${source_sans.className} h-full`}>
      <body className="bg-aesir-dark flex flex-col h-full gap-4">
        <nav className="bg-aesir p-4 flex flex-row items-center gap-8">
          <Logo />
          <header className="font-bold text-2xl">
            Assets and graphical design
          </header>

          <aside className="flex-1 flex justify-end">
            <Link href="https://aesir.se">
              <Icon path={mdiLink} className="w-4 h-4 inline mr-0.5" />
              aesir.se
            </Link>
          </aside>
        </nav>
        <section className="flex-1 p-4">{children}</section>
        <footer className="bg-aesir-medium px-4 py-8 flex flex-col items-center gap-8">
          <p>
            Developed by{" "}
            <Link className="underline" href="https://github.com/eweilow">
              <Icon path={mdiGithub} className="w-4 h-4 inline mr-0.5" />
              eweilow
            </Link>{" "}
            for ÆSIR - Association of Engineering Students in Rocketry 🚀
          </p>
          <p>Last deployed {format(now, "yyyy-MM-dd")}</p>
        </footer>
      </body>
    </html>
  );
}
