'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TorusKnot } from '@react-three/drei'

export function MetalTorus() {
  const ref = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.2
      ref.current.rotation.y += delta * 0.35
    }
  })

  return (
    <group ref={ref}>
      <TorusKnot args={[1.8, 0.6, 128, 32]}>
        <meshStandardMaterial
          metalness={0.95}
          roughness={0.15}
          color="#111111"
          emissive="#00ffff"
          emissiveIntensity={40}
          toneMapped={false}
        />
      </TorusKnot>
    </group>
  )
}
