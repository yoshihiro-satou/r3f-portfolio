'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import FlayingCar from './FlayingCar'

function NeonBox({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, Math.random() * 5 + 1, 1]} />
      {/* toneMapped={false} にすることで、Bloomエフェクトで強く光ります */}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={10}
        toneMapped={false}
      />
    </mesh>
  )
}

export default function CyberCity() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div style={{ width: '100%', height: '100%', background: '#000' }}>
      <Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
        <color attach="background" args={['#000']} />
        
        {/* 環境光は暗めにしてネオンを際立たせる */}
        <ambientLight intensity={0.1} />

        {/* ビル群のシミュレーション */}
        {[-4, -2, 0, 2, 4].map((x) => (
          [-4, -2, 0, 2, 4].map((z) => (
            <NeonBox
              key={`${x}-${z}`}
              position={[x * 2, 0, z * 2]}
              color={Math.random() > 0.5 ? "#ff00ff" : "#00ffff"}
            />
          ))
        ))}

        <FlayingCar
        startPos={[-10, 1, -5]}
        endPos={[10, 3, -5]}
        color={'#00ffff'}
      />
      <FlayingCar
        startPos={[8, 3, 5]}
        endPos={[-8, 1, -5]}
        color={'#00ffff'}
      />
      <FlayingCar
        startPos={[-10, 1, -5]}
        endPos={[10, 3, -5]}
        color={'#ffff00'}
      />

        {/* グリッドの床 */}
        <gridHelper args={[100, 50, "#333", "#111"]} position={[0, -0.5, 0]} />

        {/* ポストプロセッシング（エフェクト） */}
        <EffectComposer>
          <Bloom
            intensity={1.5}      // 光の強さ
            luminanceThreshold={1} // どの明るさから光らせるか
            mipmapBlur           // きれいなぼかし
          />
          <Noise opacity={0.05} /> フィルムのような粒子感
          <Vignette eskil={false} offset={0.1} darkness={1.1} /> {/* 四隅を暗くする */}
        </EffectComposer>

        <OrbitControls />
      </Canvas>
    </div>
  )
}
