'use client'

import { useBox } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import * as THREE from 'three'

interface Props {
  side: 'left' | 'right'
  isMobile: boolean
}

export default function Flipper({ side, isMobile }: Props) {
  const { viewport } = useThree()
  const [ref, api] = useBox(() => ({
    mass: 0,
    position: side === 'left' ? [-3, 1, 0] : [3, 1, 0],
    args: [4, 0.8, 1.2],
    rotation: [0, 0, side === 'left' ? 0.4 : -0.4],
  }))

  const [up, setUp] = useState(false)

  // キーボード操作（PC）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (side === 'left' && (e.key === 'z' || e.key === 'ArrowLeft')) setUp(true)
      if (side === 'right' && (e.key === 'm' || e.key === 'ArrowRight')) setUp(true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (side === 'left' && (e.key === 'z' || e.key === 'ArrowLeft')) setUp(false)
      if (side === 'right' && (e.key === 'm' || e.key === 'ArrowRight')) setUp(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [side])

  // モバイルタッチ操作
  useEffect(() => {
    if (!isMobile) return
    const handleTouchStart = (e: TouchEvent) => {
      if (side === 'left' && e.touches[0]?.clientX < window.innerWidth / 2) setUp(true)
      if (side === 'right' && e.touches[0]?.clientX >= window.innerWidth / 2) setUp(true)
    }
    const handleTouchEnd = () => setUp(false)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile, side])

  useFrame(() => {
  if (!api) return

  const targetAngle = up
    ? (side === 'left' ? 0.8 : -0.8)
    : (side === 'left' ? 0.4 : -0.4)

  // クォータニオンを作成して直接セット
  const quat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    targetAngle
  )

  api.quaternion.set(quat.x, quat.y, quat.z, quat.w)
})
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[4, 0.8, 1.2]} />
      <meshStandardMaterial color="#e91e63" metalness={0.8} roughness={0.3} />
    </mesh>
  )
}
