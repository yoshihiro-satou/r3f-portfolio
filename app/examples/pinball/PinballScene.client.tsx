'use client'

import { Canvas } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import { Physics } from '@react-three/cannon'
import { OrbitControls } from '@react-three/drei'

import Walls from './Walls.client'
import Ball from './Ball.client'
import Flipper from './Flipper.client'
import ScoreDisplay from './ScoreDisplay'

export default function PinballScene() {
  const [score, setScore] = useState(0)           // ← スペース追加
  const [isMobile, setIsMobile] = useState(false) // ← スペース追加

  // レスポンシブ判定（クリーンアップも正しく）
  useEffect(() => {
    const checkMobile = () => window.innerWidth < 768

    // 初回チェック
    setIsMobile(checkMobile())

    // リサイズ時の処理を関数に切り出し
    const handleResize = () => setIsMobile(checkMobile())
    window.addEventListener('resize', handleResize)

    // クリーンアップ（正しい削除）
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}                    // ← 15は異常値なので2に修正
        camera={{ position: [0, 8, 25], fov: isMobile ? 65 : 55 }}
      >
        <color attach="background" args={['#b8caaf']} />

          <ambientLight intensity={0.8} />

          <pointLight
            position={[0, 15, 0]}
            intensity={4}               // 強くして上から全体照らす
            color="#ffffff"
            distance={40}               // 範囲を広げる
            castShadow
          />

          <pointLight 
            position={[8, 10, 5]} 
            intensity={3.5}
            color="#ffcc88"             // 少し暖色でリアル感
            castShadow
          />

          <pointLight 
            position={[-8, 10, 5]} 
            intensity={3.5}
            color="#88ccff"             // 反対側に青みでコントラスト
            castShadow
          />

        <Physics gravity={[0, -20, 0]} allowSleep={false}>
          <Walls />
          <Ball onScore={() => setScore(s => s + 100)} />
          <Flipper side="left" isMobile={isMobile} />
          <Flipper side="right" isMobile={isMobile} />
        </Physics>

        {/* 開発中はコメントアウト推奨 */}
        {/* <Debug /> */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={!isMobile}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    <ScoreDisplay score={score} />
    </>
  )
}
