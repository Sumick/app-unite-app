import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quick Poll Creator",
  description: "Szybkie ankiety dla samorządów - wyniki live, zero logowania",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
