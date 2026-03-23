"use client"

import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { Environment } from "@react-three/drei"
import Board from "./Board"
import Ball from "../Ball"
import Flipper from "./Flipper"
import { GameProvider, useGame } from "./GameState"
import GameOverlay from "./GameOverlay"

function SceneContents() {
  const { started, ballKey, setGameOver } = useGame();

  return (
    <>
      <Physics gravity={[0, -10, 0]}>
        <Board />
        {started && (
          <Ball position={[-5, 6, 0]} ballKey={ballKey} onFall={() => setGameOver(true)} />
        )}

        <Flipper position={[-6, -3, 0]} isLeft={true} />
        <Flipper position={[6, -3, 0]} isLeft={false} />
      </Physics>

      <Environment preset="city" />
    </>
  )
}

export default function GameScene() {
  return (
    <GameProvider>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 50}} >
          <SceneContents />
        </Canvas>
        <GameOverlay />
      </div>
    </GameProvider>
  )
}
