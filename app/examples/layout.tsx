import type { Metadata } from "next";

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
      <header>
        <h1>hone</h1>
      </header>
      {children}
    </>
  );
}
