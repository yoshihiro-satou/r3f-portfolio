// src/components/three/ListScene.client.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import FloatingCard from './FloatingCard.client'
import { SpaceItem } from '@/lib/items'

interface Props {
  items: SpaceItem[]
}

export default function ListScene({ items }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 4, 32], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
    >
      {/* 宇宙背景 */}
      <Stars
        radius={120}
        depth={60}
        count={8000}
        factor={5}
        saturation={0.2}
        fade
        speed={0.3}
      />

      {/* 軽い霧で奥行き感 */}
      <fog attach="fog" args={['#000022', 15, 80]} />

      {/* リストアイテム */}
      {items.map((item, index) => (
        <FloatingCard
          key={item.id}
          item={item}
          index={index}
          total={items.length}
        />
      ))}

      <ambientLight intensity={0.35} />
      <pointLight position={[15, 15, 10]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-12, -8, -15]} intensity={0.9} color="#a78bfa" />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={18}
        maxDistance={50}
        dampingFactor={0.06}
        rotateSpeed={0.45}
      />
    </Canvas>
  )
}
