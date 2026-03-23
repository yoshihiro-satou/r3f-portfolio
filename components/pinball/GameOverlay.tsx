"use client"

import React from "react";
import styled from "styled-components";
import { useGame } from "./GameState";

export default function GameOverlay() {
  const { started, start, reset, gameOver } = useGame();

  return (
    <Overlay>
      {!started && (
        <div className="panel">
          <button className="btn" onClick={start}>Start</button>
        </div>
      )}

      {started && (
        <div className="controls">
          <button className="btn small" onClick={reset}>Reset</button>
        </div>
      )}

      {gameOver && (
        <div className="gameover">
          <div className="box">
            <h1>Game Over</h1>
            <button className="btn" onClick={reset}>Try Again</button>
          </div>
        </div>
      )}
    </Overlay>
  );
}

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;

  .panel {
    position: absolute;
    left: 50%;
    bottom: 6rem;
    transform: translateX(-50%);
    pointer-events: auto;
  }

  .controls {
    position: absolute;
    right: 1rem;
    top: 1rem;
    pointer-events: auto;
  }

  .gameover {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
  }

  .box {
    background: rgba(0,0,0,0.85);
    color: white;
    padding: 2rem;
    border-radius: 0.8rem;
    text-align: center;
  }

  .btn {
    pointer-events: auto;
    background: #ff0066;
    color: white;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 0.4rem;
    cursor: pointer;
    font-size: 1rem;
  }

  .btn.small { padding: 0.4rem 0.6rem; font-size: 0.9rem; }
`;
