// components/dom/SmoothScroll.tsx
'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,         // スクロールの滑らかさ (0.1 = 標準, 数値を下げるほど粘りが出る)
        duration: 1.5,     // スクロールにかかる時間
        smoothWheel: true, // マウスホイールをスムーズに
        syncTouch: true,   // タッチデバイスもスムーズに
      }}
    >
      {children}
    </ReactLenis>
  );
}
