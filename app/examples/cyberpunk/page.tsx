'use client';

import { ReactLenis } from 'lenis/react';
import { useScrollStore } from './store/useScrollStore';
import BackgroundCanvas from './components/scene/BackgroundCanvas';
export default function page() {
  const setProgress = useScrollStore((state)=> state.setProgress);
  return (
    // Lenisでスムーズスクロールを提供し。スクロール時にZustandを更新
    <ReactLenis
      root
      options={{ lerp: 0.05 }}
      onScroll={(e) => setProgress(e.progress)}
    >
      {/* 背景の３Dキャンバス(z-indexで最背面に固定) */}
      <div className='fixed inset-0 z-[-1] bg-black'>
        <BackgroundCanvas />
      </div>

      {/* 前面のHTMLコンテンツ(通常通りマークアップ可能) */}
      <main className='relative z-10 w-full text-white'>
        <section className='flex h-screen items-center justify-start px-10 md:px-24'>
          <h1 className='text-6xl font-bold uppercase tracking-tighter mix-blend-difference'>
            Cyberpunk<br />Initiation
          </h1>
        </section>
        <section className='flex h-screen items-center justify-end px-10 md:px-24'>
          <div className='max-w-md text-right mix-blend-difference'>
            <h2 className='text-4xl font-bold'>Neural Link</h2>
            <p className='mt-4 text-gray-300'>Drag the object to interact with now york.</p>
          </div>
        </section>

        <section className='flex h-[150vh] items-center justify-center'>
          <h2 className='text-5xl font-bold mix-blend-difference'>System Override</h2>
        </section>
      </main>
    </ReactLenis>
  )
}
