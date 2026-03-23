"use client"

import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'

// 1. モデルを読み込む線湯尾コンポーネント
function MyModel() {
  // publicフォルダをルート(/)としてパスを指定
  const { scene } = useGLTF("/models/Computer_Structure.glb");

  // 読み込んだsceneをprimitiveオブジェクトとしてそのまま配置
  return <primitive object={scene} scale={0.2} position={[0, -1, 0]} />
}

// 2. ローディング中に表示する「代役」コンポーネント
function FallbackBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" wireframe />
    </mesh>
  );
}

// 3. メインのシーン構築
export default function R3Fpage() {
  return (
    <div style={{ width: '100vw', height: '100vh',}}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50}}>

        {/* ライトの設定（モデルをきれいに見せるため） */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset='city' />

        {/* Suspenseで囲むのがReact流 */}
        <Suspense fallback={<FallbackBox />}>
          <MyModel />
        </Suspense>

        <OrbitControls />
      </Canvas>
    </div>
  )
}
