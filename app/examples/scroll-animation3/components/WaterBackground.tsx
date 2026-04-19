'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

// 1. シェーダーを文字列として定義（外部ファイルに分けてインポートしてもOKです）
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uRippleCenter;
  uniform float uRippleTime;
  varying vec2 vUv;

  void main() {
    vec3 shallowColor = vec3(0.1, 0.6, 0.8);
    vec3 deepColor = vec3(0.0, 0.05, 0.15);
    vec3 depthColor = mix(shallowColor, deepColor, uScroll);

    vec2 distortedUv = vUv + vec2(sin(vUv.y * 10.0 + uTime) * 0.02, cos(vUv.x * 10.0 + uTime) * 0.02);
    
    float dist = distance(distortedUv, uRippleCenter);
    float rippleEffect = sin(dist * 50.0 - uRippleTime * 10.0) * exp(-dist * 5.0 - uRippleTime * 2.0);
    rippleEffect *= step(0.01, uRippleTime); 

    vec3 finalColor = depthColor + vec3(rippleEffect * 0.2);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function WaterBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const scrollData = useScroll() 
  
  const rippleData = useRef({ time: 0, isActive: false })

  // 2. useMemoを使ってUniformsを定義 (再レンダリング時のオブジェクト再生成を防ぐ最適化)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uRippleCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uRippleTime: { value: 0 },
    }),
    []
  )

  useFrame((state, delta) => {
    if (!materialRef.current) return

    // 3. ネイティブのShaderMaterialでは、値へのアクセスは `.uniforms.[key].value` となります
    materialRef.current.uniforms.uTime.value += delta
    materialRef.current.uniforms.uScroll.value = scrollData.offset

    if (rippleData.current.isActive) {
      rippleData.current.time += delta
      materialRef.current.uniforms.uRippleTime.value = rippleData.current.time
      
      if (rippleData.current.time > 3.0) {
        rippleData.current.isActive = false
        rippleData.current.time = 0
        materialRef.current.uniforms.uRippleTime.value = 0
      }
    }
  })

  const handlePointerDown = (e: any) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uRippleCenter.value.set(e.uv.x, e.uv.y)
    rippleData.current.isActive = true
    rippleData.current.time = 0
    materialRef.current.uniforms.uRippleTime.value = 0
  }

  return (
    <mesh onPointerDown={handlePointerDown}>
      {/* 画面全体を覆うために少し大きめのプレーンを配置 */}
      <planeGeometry args={[10, 10, 32, 32]} />
      
      {/* 4. extendされたタグではなく、R3FネイティブのshaderMaterialタグを使用 */}
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  )
}
