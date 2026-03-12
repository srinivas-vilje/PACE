import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PACE — Prompt Analysis & Composition Engine",
  description: "Advanced Prompt Analysis & Composition Engine for AI workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
