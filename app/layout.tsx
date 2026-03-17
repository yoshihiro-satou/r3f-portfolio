import type { Metadata } from "next";
import "./globals.css";
import { passeroOne } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "REACT THREE FIBERのサンプル集",
  description: "AIに相談しながらいろいろと試した作品集です。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={passeroOne.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
