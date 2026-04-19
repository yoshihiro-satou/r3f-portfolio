"use client";

import dynamic from 'next/dynamic';

const UnderwaterScene = dynamic(
  () => import('./UnderwaterScene'),
  { ssr: false, loading: () => <p>ダイビング中...</p> }
);

export function SceneWrapper() {
  return <UnderwaterScene />;
}
