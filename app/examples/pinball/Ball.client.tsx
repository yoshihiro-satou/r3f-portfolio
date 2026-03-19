'use client'

import { useSphere } from '@react-three/cannon'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'   // ← これを追加

interface Props {
  onScore: () => void
}

export default function Ball({ onScore }: Props) {
  const [ref, api] = useSphere<THREE.Mesh>(() => ({
    mass: 1,
    position: [0, 12, 0],
    args: [0.8],
    restitution: 0.9,
    linearDamping: 0.05,
  }))

  useFrame(() => {
    if (!ref.current) return

    const yPosition = ref.current.position.y

    if (yPosition < -10) {
      api.position.set(0, 12, 0)
      api.velocity.set(0, 0, 0)
      onScore()
    }
  })

  return (
    <Sphere ref={ref} args={[0.8, 32, 32]} castShadow>
      <meshStandardMaterial
        color="#ffeb3b"
        emissive="#ffeb3b"
        emissiveIntensity={0.8}
        metalness={0.4}
        roughness={0.3}
      />
    </Sphere>
  )
}
