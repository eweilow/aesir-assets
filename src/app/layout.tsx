import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";

import "./globals.css";

const source_sans = Source_Sans_3({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ÆSIR Assets",
  description:
    "Assets and graphical design for ÆSIR - Association of Engineering Students in Rocketry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={source_sans.className}>
      <body className="bg-aesir-dark">{children}</body>
    </html>
  );
}
