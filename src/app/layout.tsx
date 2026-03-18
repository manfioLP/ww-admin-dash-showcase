import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { LayoutShell } from "@/components/layout/LayoutShell";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WaniWani Admin",
  description: "AI distribution infrastructure admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
