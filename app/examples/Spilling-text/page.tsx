'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// 各文字のデータ型
type Letter = {
  char: string
  originalPosition: THREE.Vector3
  position: THREE.Vector3
  velocity: THREE.Vector3
  ref: THREE.Mesh | null
  fontSize: number
}

// AnimatedLettersコンポーネント
function AnimatedLetters({ isFalling }: { isFalling: boolean }) {
  const lettersData = useRef<Letter[]>([])

  // 重力・床・アニメーション定数
  const gravity = 35
  const bottomY = -1.9
  const lerpFactor = 0.18

  // ======================
  // フォントサイズを16px相当に調整（フルスクリーン基準）
  // ======================
  const titleFontSize = 0.04          // ≈16pxに見えるサイズ（h1用に少し大きめ）
  const descFontSize = 0.025           // ≈16pxに見えるサイズ（p用）

  // 重なり防止のため間隔を十分に広げました（Noto Sans JPの全角文字幅に合わせた最適値）
  const titleSpacing = 1.2
  const descSpacing = 0.07
  const descLineHeight = 0.08

  // 文字データの初期化
  useEffect(() => {
    const data: Letter[] = []

    // ======================
    // H1タイトル部分
    // ======================
    const title = 'タイトル'
    const titleChars = title.split('')
    const titleY = 1.05
    const titleStartX = -(titleChars.length * titleSpacing) / 2

    titleChars.forEach((char, i) => {
      const x = titleStartX + i * titleSpacing
      data.push({
        char,
        originalPosition: new THREE.Vector3(x, titleY, 0),
        position: new THREE.Vector3(x, titleY, 0),
        velocity: new THREE.Vector3(),
        ref: null,
        fontSize: titleFontSize,
      })
    })

    // ======================
    // P説明文部分（改行対応）
    // ======================
    const description = ``
    const descLines = description.split('\n')
    const descY = 0.45
    let currentY = descY

    descLines.forEach((line) => {
      const lineChars = line.split('')
      if (lineChars.length === 0) return

      const lineStartX = -(lineChars.length * descSpacing) / 2

      lineChars.forEach((char, i) => {
        const x = lineStartX + i * descSpacing
        data.push({
          char,
          originalPosition: new THREE.Vector3(x, currentY, 0),
          position: new THREE.Vector3(x, currentY, 0),
          velocity: new THREE.Vector3(),
          ref: null,
          fontSize: descFontSize,
        })
      })

      currentY -= descLineHeight
    })

    lettersData.current = data
  }, [])

  // 落下開始時に初速を与える
  useEffect(() => {
    if (isFalling && lettersData.current.length > 0) {
      lettersData.current.forEach((letter) => {
        letter.velocity.set(
          (Math.random() - 0.5) * 5,
          -7 - Math.random() * 5,
          (Math.random() - 0.5) * 2
        )
      })
    }
  }, [isFalling])

  const bounceFactor = 0.6; // 跳ね返り係数 (0〜1: 1に近いほどよく跳ねる)
  const stopThreshold = 0.1; // 停止判定のしきい値

  // 毎フレームの物理・アニメーション処理
  useFrame((state, delta) => {
    lettersData.current.forEach((letter) => {
      if (!letter.ref) return

      if (isFalling) {
        letter.velocity.y -= gravity * delta
        letter.position.addScaledVector(letter.velocity, delta)

        if (letter.position.y < bottomY) {
          letter.position.y = bottomY
          letter.velocity.y *= -bounceFactor;
          if(Math.abs(letter.velocity.y) < stopThreshold) {
            letter.velocity.y = 0;
          }

        }

        letter.velocity.multiplyScalar(0.97)
      } else {
        letter.position.lerp(letter.originalPosition, lerpFactor)
        letter.velocity.set(0, 0, 0)
      }

      letter.ref.position.copy(letter.position)

      if (isFalling) {
        letter.ref.rotation.y = letter.velocity.x * 0.03
        letter.ref.rotation.x = letter.velocity.y * 0.015
      } else {
        letter.ref.rotation.set(0, 0, 0)
      }
    })
  })

  return (
    <>
      {lettersData.current.map((letter, index) => (
        <Text3D
          key={`${letter.char}-${index}`}
          ref={(mesh) => {
            if (mesh) letter.ref = mesh
          }}
          position={letter.originalPosition.toArray()}
          font="/fonts/Noto Sans JP_Regular.json"
          // @ts-expect-error: fontSize is supported by Text3D even if missing in type definitions
          fontSize={letter.fontSize}
          letterSpacing={0}
          lineHeight={1}
          anchorX="center"
          anchorY="middle"
          bevelEnabled
          bevelThickness={0.008}
          bevelSize={0.008}
          bevelOffset={0}
          bevelSegments={8}
          curveSegments={12}
          color="#222222"
        >
          {letter.char}
        </Text3D>
      ))}
    </>
  )
}

// 全体の3Dシーン
function Scene({ isFalling }: { isFalling: boolean }) {
  return (
    <>
      {/* 16px相当になるようfovを50度に固定（視野を調整） */}
      <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={50} />

      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />

      {/* カード背景（テキストが小さくなったので余白を大きくして見やすいカードに） */}
      <mesh position={[0, 0, -0.12]}>
        <planeGeometry args={[8.8, 4.3]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
      <mesh position={[0, 0, -0.15]}>
        <planeGeometry args={[8.9, 4.4]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>

      <AnimatedLetters isFalling={isFalling} />
    </>
  )
}

export default function Page() {
  const [isFalling, setIsFalling] = useState(false)

  return (
    <div className="relative w-screen h-screen bg-zinc-950 flex items-center justify-center overflow-hidden">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene isFalling={isFalling} />
      </Canvas>

      {/* ボタン */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => setIsFalling((prev) => !prev)}
          className="px-10 py-5 bg-white hover:bg-zinc-100 active:scale-95 transition-all duration-200 text-zinc-900 font-bold text-2xl rounded-3xl shadow-2xl flex items-center gap-3 border border-zinc-200"
        >
          {isFalling ? (
            <>
              <span>🔄</span>
              <span>文字を元に戻す</span>
            </>
          ) : (
            <>
              <span>↓</span>
              <span>文字を落とす</span>
            </>
          )}
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-400 text-sm font-mono">
        Next.js + R3F • Noto Sans JP • フォントサイズ16px相当に調整済み
      </div>
    </div>
  )
}
