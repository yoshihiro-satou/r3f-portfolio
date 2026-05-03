// app/mouse-shader/page.tsx
"use client"
import dynamic from "next/dynamic";

// R3F は SSR 不可なので dynamic import
const Experience = dynamic(() => import("./Experience"), { ssr: false });

export default function MouseShaderPage() {
  return (
    <main className="w-full h-screen bg-black">
      <Experience />
    </main>
  );
}
