"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

type GameContextType = {
  started: boolean;
  gameOver: boolean;
  ballKey: number;
  start: () => void;
  reset: () => void;
  setGameOver: (v: boolean) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const c = useContext(GameContext);
  if (!c) throw new Error("useGame must be used within GameProvider");
  return c;
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [ballKey, setBallKey] = useState(0);

  const start = () => {
    setGameOver(false);
    setStarted(true);
    setBallKey((k) => k + 1);
  };

  const reset = () => {
    // 一旦 started を false にしてから再生成することで
    // GameOver 表示が確実に消えるようにする
    setGameOver(false);
    setStarted(false);
    setBallKey((k) => k + 1);
    // 次のtickで再度開始
    setTimeout(() => setStarted(true), 0);
  };

  return (
    <GameContext.Provider value={{ started, gameOver, ballKey, start, reset, setGameOver }}>
      {children}
    </GameContext.Provider>
  );
}

export default GameContext;
