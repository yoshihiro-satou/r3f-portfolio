'use client'

import { useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { NeonText } from './NeonText'

const HoloGlitchMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color('#00ffee'), glitchStrength: 0.8 },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float time;
    uniform vec3 color;
    uniform float glitchStrength;
    varying vec2 vUv;

    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }

    void main() {
      vec2 uv = vUv;
      float glitch = step(0.96, random(vec2(floor(uv.y * 70.0), time))) * glitchStrength;
      uv.x += (random(vec2(time, uv.y)) - 0.5) * 0.12 * glitch;

      float scan = sin(uv.y * 900.0 - time * 80.0) * 0.03;
      float flicker = 0.9 + 0.1 * sin(time * 25.0);

      vec3 col = color * (1.0 + scan + glitch * 2.0) * 30.0;
      col *= flicker;

      float alpha = 0.75 + 0.25 * sin(time * 5.0);
      gl_FragColor = vec4(col, alpha * (1.0 - glitch * 0.3));
    }
  `
)

extend({ HoloGlitchMaterial })

type HoloPanelProps = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  color?: string
  title?: string
  autoRotate?: boolean
}

export function HoloPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [4, 2.5, 1],
  color = '#00ffee',
  title = 'ACCESS',
  autoRotate = true,
}: HoloPanelProps) {
  const matRef = useRef<any>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if(matRef.current) {
      matRef.current.time += delta * 1.8
      matRef.current.glitchStrength = THREE.MathUtils.lerp(
        matRef.current.glichStrength,
        Math.random() > 0.95 ? 3.5 : 0.7,
        0.15
      )
    }
    if(autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh scale={scale}>
        <planeGeometry />
        <holoGlitchMaterial ref={matRef} color={color} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* ホログラム上にネオン文字を少し浮かせて重ねる */}
      <NeonText
        position={[0, 0, 0.05]}
        size={0.9}
        color={color}
      >
        {title}
      </NeonText>
    </group>
  )
}
