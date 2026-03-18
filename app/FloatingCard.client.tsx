// src/components/three/FloatingCard.client.tsx
'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere, Ring, Html } from '@react-three/drei'
import * as THREE from 'three'
import { SpaceItem } from '@/lib/items'
import  Link  from 'next/link'
interface Props {
  item: SpaceItem
  index: number
  total: number
}

export default function FloatingCard({ item, index, total }: Props) {
  const groupRef = useRef<THREE.Group>(null!)
  const sphereRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  // 円形配置（アイテムが増えても自然に広がる）
  const angle = (index / total) * Math.PI * 2
  const radius = 14 + total * 0.4 // アイテム数に応じて少し広げる
  const baseX = Math.cos(angle) * radius
  const baseZ = Math.sin(angle) * radius

  useFrame((state) => {
    if (!groupRef.current) return

    const t = state.clock.getElapsedTime() + index * 1.2

    // 浮遊アニメーション（軽量化：sin/cosのみ）
    groupRef.current.position.y = Math.sin(t * 0.8) * 1.4

    // ゆっくり自転
    groupRef.current.rotation.y += 0.003

    // ホバー時のスケール・発光
    const targetScale = hovered ? 1.28 : 1
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.09)

    // 発光をlerpでスムーズに
    if (sphereRef.current?.material) {
      const mat = sphereRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        hovered ? 0.7 : 0.15,
        0.1
      )
    }
  })

  return (
    <group
      ref={groupRef}
      position={[baseX, 0, baseZ]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 惑星本体 - 少し小さくしてTextが見えやすく */}
      <Sphere ref={sphereRef} args={[2.1, 48, 32]}>
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={0.15}  // 初期値
          metalness={0.35}
          roughness={0.45}
        />
      </Sphere>

      {/* リング - 少し内側に調整してTextを邪魔しない */}
      <Ring args={[2.3, 3.4, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={item.color} side={THREE.DoubleSide} transparent opacity={0.55} />
      </Ring>

      {/* 名前テキスト - 球体の上に明確に浮かせる */}
      <Text
        position={[0, 2.6, 0.4]}     // yを高く、zを外側にずらす（隠れにくく）
        fontSize={1.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {item.name}
      </Text>

      {/* 説明テキスト - 下部に配置し、読みやすく */}
      <Text
        position={[0, -0.3, 3.5]}    // 下に移動 + zを外側に
        fontSize={0.48}
        color="#e0e0ff"
        anchorX="center"
        anchorY="middle"
        maxWidth={4.0}
        textAlign="center"
      >
        {item.description}
      </Text>

      {/* ボタン - さらに下に配置して視認性確保 */}
      <Html
        center
        position={[0, -3.2, 0.6]}    // 下に下げ、zを少し外側に
        transform
        occlude
        style={{ pointerEvents: 'auto' }}
      >
        <Link
          className="
            relative overflow-hidden
            bg-gradient-to-br from-indigo-900/75 to-purple-900/75
            backdrop-blur-lg px-8 py-4 rounded-2xl
            text-white text-base font-semibold tracking-wide
            border border-cyan-400/50 hover:border-cyan-300
            shadow-[0_0_25px_rgba(34,211,238,0.4)]
            hover:shadow-[0_0_40px_rgba(34,211,238,0.7)]
            transition-all duration-300 ease-out
            active:scale-95
          "
          href={item.href ?? '/'}
        >
          <span className="relative z-10">探査する</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
        </Link>
      </Html>
    </group>
  )
}
