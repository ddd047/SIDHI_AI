import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIDHI AI — Simplify. Solve. Succeed.",
  description:
    "SIDHI AI is a next-generation AI startup building intelligent solutions to simplify complexity, solve real-world problems, and help you succeed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} min-h-full antialiased`}>
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
