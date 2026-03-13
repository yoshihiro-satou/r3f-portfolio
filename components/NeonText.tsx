'use client'

import { useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { Text3D, Center, Float, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// NeonMaterial の定義（前の修正版のまま）
const NeonMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color('#00ffff') },
  `varying vec2 vUv;
   void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `uniform float time;
   uniform vec3 color;
   varying vec2 vUv;
   void main() {
     float glow = 0.5 + 0.5 * sin(time * 3.0 + vUv.y * 10.0);
     vec3 col = color * glow * 45.0;
     gl_FragColor = vec4(col, 1.0);
   }`
)

extend({ NeonMaterial })

type NeonTextProps = {
  children: string
  size?: number
  color?: string
  position?: [number, number, number]
}

export function NeonText({ children, size = 1, color = '#00ffff', position }: NeonTextProps) {
  const matRef = useRef<any>(null)

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.time += delta
  })

  return (
    <Float floatIntensity={1.2} floatingRange={[0, 0.8]} speed={1.5}>
      <Center>
        <Text3D
          font="/fonts/Orbitron_Regular.json"
          size={size}
          height={0.12}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.01}
          position={position}
        >
          <neonMaterial ref={matRef} color={color} />
          {children}
        </Text3D>
      </Center>
    </Float>
  )
}
