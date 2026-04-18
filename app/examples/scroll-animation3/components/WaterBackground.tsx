'use client'

import { useRef } from 'react'
import { useFrame, extend, ThreeEvent } from '@react-three/fiber'
import { useScroll, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Extend ThreeElements for TypeScript
declare module '@react-three/fiber' {
  interface ThreeElements {
    waterShaderMaterial: { ref?: React.Ref<THREE.ShaderMaterial> }
  }
}

// 1. カスタムシェーダーの定義
const WaterShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uScroll: 0,
    uRippleCenter: new THREE.Vector2(0.5, 0.5),
    uRippleTime: 0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uRippleCenter;
    uniform float uRippleTime;
    varying vec2 vUv;

    // シンプルなノイズ関数（波の表現用）
    float random(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    void main() {
      // スクロールによる水深の色の変化（浅瀬の水色から、深海のダークブルーへ）
      vec3 shallowColor = vec3(0.1, 0.6, 0.8);
      vec3 deepColor = vec3(0.0, 0.05, 0.15);
      vec3 depthColor = mix(shallowColor, deepColor, uScroll);

      // 時間経過による揺らぎ
      vec2 distortedUv = vUv + vec2(sin(vUv.y * 10.0 + uTime) * 0.02, cos(vUv.x * 10.0 + uTime) * 0.02);
      
      // 波紋の計算
      float dist = distance(distortedUv, uRippleCenter);
      float rippleEffect = sin(dist * 50.0 - uRippleTime * 10.0) * exp(-dist * 5.0 - uRippleTime * 2.0);
      
      // uRippleTimeが0の時は波紋を消す
      rippleEffect *= step(0.01, uRippleTime); 

      // 色の合成
      vec3 finalColor = depthColor + vec3(rippleEffect * 0.2);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

// R3FのJSXとして使えるようにextend
extend({ waterShaderMaterial: WaterShaderMaterial })

export default function WaterBackground() {
  const materialRef = useRef<THREE.ShaderMaterial & {
    uTime: number
    uScroll: number
    uRippleCenter: THREE.Vector2
    uRippleTime: number
  }>(null)
  const scrollData = useScroll() // ScrollControlsの子コンポーネントで呼び出す必要あり
  
  // 波紋の状態管理用（useFrame内で書き換えるためReact stateではなくrefを使用）
  const rippleData = useRef({
    time: 0,
    isActive: false,
  })

  useFrame((state, delta) => {
    if (!materialRef.current) return

    // 1. 時間の更新（デバイスのフレームレートに依存しないようにdeltaを使用 ）
    materialRef.current.uTime += delta

    // 2. スクロール進捗（0 〜 1）を取得しシェーダーに渡す
    materialRef.current.uScroll = scrollData.offset

    // 3. 波紋の進行
    if (rippleData.current.isActive) {
      rippleData.current.time += delta
      materialRef.current.uRippleTime = rippleData.current.time
      // 一定時間で波紋をリセット
      if (rippleData.current.time > 3.0) {
        rippleData.current.isActive = false
        rippleData.current.time = 0
      }
    }
  })

  // ポインタークリック（または移動）で波紋を発生させるハンドラ
  const handlePointerDown = (e: ThreeEvent<PointerEvent> & { uv: THREE.Vector2 }) => {
    if (!materialRef.current) return
    // UV座標を取得して波紋の中心に設定
    materialRef.current.uRippleCenter.set(e.uv.x, e.uv.y)
    rippleData.current.isActive = true
    rippleData.current.time = 0
    materialRef.current.uRippleTime = 0
  }

  return (
    <mesh onPointerDown={handlePointerDown}>
      <planeGeometry args={[10, 10, 32, 32]} />
      {/* TypeScriptの型エラーを避けるため any などを適宜設定 */}
      <waterShaderMaterial ref={materialRef} />
    </mesh>
  )
}
