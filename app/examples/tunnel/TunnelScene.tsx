'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// ─── トンネルパス（共通化）───
function useTunnelCurve() {
  return useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,  0,   0),
    new THREE.Vector3(2,  1,  -10),
    new THREE.Vector3(-2, -1, -20),
    new THREE.Vector3(1,  2,  -30),
    new THREE.Vector3(0,  0,  -50),
  ]), [])
}

// ─── トンネル本体 ───
function Tunnel() {
  const curve = useTunnelCurve()
  const geometry = useMemo(() =>
    new THREE.TubeGeometry(curve, 200, 2, 8, false), [curve])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#1a0533"
        side={THREE.BackSide}
        emissive="#3b0764"      // ← 自己発光。Bloomが拾って光らせる
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

// ─── カメラリグ ───
function CameraRig() {
  const scroll = useScroll()
  const curve = useTunnelCurve()

  useFrame((state) => {
    const t = scroll.offset
    const t_next = Math.min(t + 0.01, 1)
    state.camera.position.copy(curve.getPoint(t))
    state.camera.lookAt(curve.getPoint(t_next))
  })

  return null
}

// ─── 動くポイントライト ───
function MovingLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const scroll = useScroll()
  const curve = useTunnelCurve()

  useFrame((state) => {
    if (!lightRef.current) return
    const t = Math.min(scroll.offset + 0.05, 1) // カメラより少し先を照らす
    const pos = curve.getPoint(t)
    lightRef.current.position.copy(pos)

    // 時間で色を周期的に変化させる
    const hue = (state.clock.elapsedTime * 0.1) % 1
    lightRef.current.color.setHSL(hue, 1, 0.6)
  })

  return (
    <pointLight
      ref={lightRef}
      intensity={3}
      distance={15}
    />
  )
}

// ─── パーティクル ───
function Particles() {
  const count = 200
  const positions = useRef<Float32Array | null>(null)
  if (!positions.current) {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 3
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3
      arr[i * 3 + 2] = -Math.random() * 50
    }
    positions.current = arr
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current!, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a78bfa"
        size={0.05}
        sizeAttenuation
      />
    </points>
  )
}

// ─── メイン ───
export default function TunnelScene() {
  return (
    <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
      <ambientLight intensity={0.1} />
      <fog attach="fog" args={['#0a0015', 5, 25]} />

      <ScrollControls pages={5} damping={0.3}>
        <CameraRig />
        <Tunnel />
        <MovingLight />
        <Particles />
      </ScrollControls>

      {/* ポストプロセッシングはScrollControlsの外に置く */}
      <EffectComposer>
        <Bloom
          intensity={1.5}       // 光の強さ
          luminanceThreshold={0.3} // この明るさ以上にBloomがかかる
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  )
}
