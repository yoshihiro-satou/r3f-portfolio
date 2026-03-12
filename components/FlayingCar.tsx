'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FlayingCarProps {
  startPos: [number, number, number]
  endPos: [number, number, number]
  color:string
}

export default function  FlayingCar({ startPos, endPos, color}: FlayingCarProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  // コンポーネントが作られた時に、一度だけ連ダムなズレ(0~3秒)を生成
  // useMemowp使うことで再レンダリングされても値が変わりません
  const delay = useMemo(() => Math.random() * 3, [])

  useFrame((state) => {
    // 3秒間で 0.0 から 1.0 まで変化する値を作る
    // state.clock.elapsedTime は開始からの経過時間（秒）
    const time = state.clock.getElapsedTime()
    const progress = ((time + delay) % 3) / 3 // 0から1のループ

    // statePos から endPos までの罫線補完(lerp)で移動させる
    meshRef.current.position.x = THREE.MathUtils.lerp(startPos[0], endPos[0], progress)
    meshRef.current.position.y = THREE.MathUtils.lerp(startPos[1], endPos[1], progress)
    meshRef.current.position.z = THREE.MathUtils.lerp(startPos[2], endPos[2], progress)

    // 前方にっ済んでいる感を出すため、少し引き延ばす（残像演出）
    meshRef.current.scale.z = 2
  })

  return (
    <mesh ref={meshRef}>
      {/* 斜体本体というより、光の粒（トレイル）として表現 */}
      <boxGeometry args={[0.2, 0.1, 0.2]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={20}
        toneMapped={false}
      />
    </mesh>
  )
}
