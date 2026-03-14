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
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
