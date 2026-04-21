// app/page.tsx
'use client';

import { ReactLenis } from 'lenis/react';
import { useScrollStore } from './store/useScrollStore';
import BackgroundCanvas from './components/scene/BackgroundCanvas';

export default function Page() {
  const setProgress = useScrollStore((state) => state.setProgress);

  return (
    <ReactLenis root options={{ lerp: 0.05 }} onScroll={(e) => setProgress(e.progress)}>
      {/* 3D背景 */}
      <div className="fixed inset-0 z-[-1] bg-black">
        <BackgroundCanvas />
      </div>

      {/* 前面コンテンツ：高さを十分に確保 (h-[500vh]) することで、スクロール時間を長くする */}
      <main className="relative z-10 w-full pointer-events-none">
        <div className="h-[500vh] flex flex-col justify-between px-10 py-24 text-white">
          <h1 className="text-6xl font-bold uppercase mix-blend-difference">System Initialization...</h1>
          <h1 className="text-6xl font-bold uppercase mix-blend-difference text-right">Entering Neural Net...</h1>
          <h1 className="text-6xl font-bold uppercase mix-blend-difference">Core Reached.</h1>
        </div>
      </main>
    </ReactLenis>
  );
}
