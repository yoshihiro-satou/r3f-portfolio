'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
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

// AnimatedLettersコンポーネント（R3F内部で文字を管理）
function AnimatedLetters({ isFalling }: { isFalling: boolean }) {
  const lettersData = useRef<Letter[]>([])

  // 重力・床・アニメーション定数（調整可能）
  const gravity = 35
  const bottomY = -1.4
  const lerpFactor = 0.18 // 元の位置に戻る速度

  // 文字データの初期化（1回だけ実行）
  useEffect(() => {
    const data: Letter[] = []

    // ======================
    // H1タイトル部分
    // ======================
    const title = 'タイトル'
    const titleChars = title.split('')
    const titleY = 1.25
    const titleSpacing = 0.32
    const titleStartX = -(titleChars.length * titleSpacing) / 2

    titleChars.forEach((char, i) => {
      const x = titleStartX + i * titleSpacing
      data.push({
        char,
        originalPosition: new THREE.Vector3(x, titleY, 0),
        position: new THREE.Vector3(x, titleY, 0),
        velocity: new THREE.Vector3(),
        ref: null,
        fontSize: 0.28,
      })
    })

    // ======================
    // P説明文部分（1行で配置。長すぎる場合は改行したい場合は後で拡張可能）
    // ======================
    const description = 'これは説明文の例です。R3Fで各文字に重力を与えて落下アニメーションを実現します。'
    const descChars = description.split('')
    const descY = 0.35
    const descSpacing = 0.175
    const descStartX = -(descChars.length * descSpacing) / 2

    descChars.forEach((char, i) => {
      const x = descStartX + i * descSpacing
      data.push({
        char,
        originalPosition: new THREE.Vector3(x, descY, 0),
        position: new THREE.Vector3(x, descY, 0),
        velocity: new THREE.Vector3(),
        ref: null,
        fontSize: 0.14,
      })
    })

    lettersData.current = data
  }, [])

  // 落下開始時に各文字に初速を与える（ランダムで自然な散らばり）
  useEffect(() => {
    if (isFalling && lettersData.current.length > 0) {
      lettersData.current.forEach((letter) => {
        letter.velocity.set(
          (Math.random() - 0.5) * 5, // 左右に少し散らばる
          -7 - Math.random() * 5,    // 下方向の初速
          (Math.random() - 0.5) * 2   // 奥行き方向も少し
        )
      })
    }
  }, [isFalling])

  // 毎フレームの物理・アニメーション処理
  useFrame((state, delta) => {
    lettersData.current.forEach((letter) => {
      if (!letter.ref) return

      if (isFalling) {
        // 重力適用
        letter.velocity.y -= gravity * delta

        // 位置更新（ベクトル演算で正確）
        letter.position.addScaledVector(letter.velocity, delta)

        // カード下部で停止（床）
        if (letter.position.y < bottomY) {
          letter.position.y = bottomY
          letter.velocity.set(0, 0, 0) // 停止（必要ならバウンド: letter.velocity.y = -letter.velocity.y * 0.3）
        }

        // 空気抵抗（徐々に減速）
        letter.velocity.multiplyScalar(0.97)
      } else {
        // 元の位置へ滑らかに戻る（lerp）
        letter.position.lerp(letter.originalPosition, lerpFactor)
        letter.velocity.set(0, 0, 0)
      }

      // Meshの位置を更新
      letter.ref.position.copy(letter.position)

      // 落下中は少し回転を加えて立体感を出す（オプション）
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
          font="/fonts/helvetiker_regular.typeface.json" // ← ここを日本語対応フォントのパスに変更（後述）
          fontSize={letter.fontSize}
          letterSpacing={0}
          lineHeight={1}
          anchorX="center"
          anchorY="middle"
          bevelEnabled
          bevelThickness={0.015}
          bevelSize={0.015}
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
      {/* 固定カメラ */}
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />

      {/* 照明 */}
      <ambientLight intensity={0.7}/>
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />

      {/* カード背景(白いカード風) */}
      <mesh position={[0, 0, -0.12]}>
        <planeGeometry args={[5.2, 3.6]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>

      {/* カードの影っぽい縁取り(オプションで立体感) */}
      <mesh position={[0, 0, -0.15]}>
        <planeGeometry args={[5.3, 3.7]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>

      {/* 文字アニメーション */}
      <AnimatedLetters isFalling={isFalling} />
    </>
  )
}

export default function
