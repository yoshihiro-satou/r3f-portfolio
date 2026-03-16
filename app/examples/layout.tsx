import type { Metadata } from "next";
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: "Examples",
  description: "AIに相談しながらいろいろと試した作品集です。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
