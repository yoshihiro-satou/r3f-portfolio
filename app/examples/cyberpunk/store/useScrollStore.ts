// 状態管理(Zustand)
// スクロール位置からCanvasへ軽量に渡すためのストア

import { create } from "zustand";

interface ScrollStore {
  progress: number;
  setProgress: (progress: number) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
}));

