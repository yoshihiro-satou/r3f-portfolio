'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei'

export default function CyberScene() {
  // コンポーネントがブラウザにマウントされたかを管理する
  const[mounted, setMounted] = useState(false)

  useEffect(() => {
    // ブラウザでの実行が始まったら true にする
    setMounted(true)
  }, [])

  // マウントされる前（サーバー側）は何も表示しない
  if(!mounted) {
    return null
  }
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} color="#00ffff" intensity={2}/>
        
        {/* メタリックで歪んだ球体の例 */}
        <Sphere args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#555"
            speed={2}
            distort={0.4}
            metalness={1}
            roughness={0.1}
          />
        </Sphere>
        <gridHelper args={[20, 20, 0xff00ff, 0x444444]} rotation={[Math.PI / 2, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
