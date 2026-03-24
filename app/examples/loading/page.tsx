"use client"

import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'

// 1. モデルを読み込む線湯尾コンポーネント
function MyModel() {
  // publicフォルダをルート(/)としてパスを指定
  const orion = useGLTF("/models/Orion.glb");
  const carpet = useGLTF("/models/Carpet_01.glb");
  // 読み込んだsceneをprimitiveオブジェクトとしてそのまま配置
  return (
    <group>
      <primitive object={orion.scene} scale={1.5} position={[0, 0, 0]} />
      <primitive object={carpet.scene} scale={0.8} position={[0, 0, 0]} />
    </group>
  )
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
    <div style={{ width: '100vw', height: '100vh', background: "#635e5e"}}>
      <Canvas camera={{ position: [0, 2, 2], fov: 50}}>

        {/* ライトの設定（モデルをきれいに見せるため） */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#fbff00" />
        <Environment preset='city' />

        {/* Suspenseで囲むのがReact流 */}
        <Suspense fallback={<FallbackBox />}>
          <MyModel />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5.5}
          maxDistance={25}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  )
}
