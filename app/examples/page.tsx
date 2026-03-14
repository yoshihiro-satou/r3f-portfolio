'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

import { NeonText } from '@/components/NeonText'
import { HoloPanel } from '@/components/HoloPanel'
import { MetalTorus } from '@/components/MetalTorus'
import { CyberGridFloor } from '@/components/CyberGridFloor'

export default function page() {
  return(
    <div className='w-screen h-screen bg-black overflow-hidden'>
      <Canvas
        camera={{ position: [0, 2, 12], fov: 45}}
        style={{ background: '#05050f'}}
      >
        <color attach="background" args={['#05020f']} />   {/* 深い紫黒でネオンが映える */}
        {/* 環境光 + 反射でメタル感爆上げ */}
        <Environment preset='night' />

        {/* 中央メタルオブジェクト */}
        <MetalTorus />

        {/* ホログラムパネル(複数配置で動きを強調) */}
        <HoloPanel
          position={[-6, 3, 2]}
          scale={[3.5, 2, 1]}
          color="#00f0ff"
          title="NEURAL"
          autoRotate={false}
        />
        <HoloPanel
          position={[6, 2, -3]}
          rotation={[0.3, 0, 0]}
          scale={[4, 2.2, 1]}
          color="#ff00cc"
          title="2077"
        />
        <HoloPanel
          position={[-4, -2, 1]}
          scale={[2.8, 1.8, 1]}
          color="#aaff00"
          title="HACK"
        />

        {/* 大きなネオンタイル */}
        <NeonText size={3.5} color="#00ffff" position={[0, 5.5, -4]}>
          CYBER
        </NeonText>
        <NeonText size={4.2} color="#ff00aa" position={[0, 2.8, -4]}>
          TOKYO
        </NeonText>

        {/* 床 */}
        <CyberGridFloor />

        {/* ライト */}
        <ambientLight intensity={0.3} color="#112244" />
        <pointLight position={[-10, 8, 5]} color="#00ffff" intensity={2} />
        <pointLight position={[10,-5, 8]} color="#ff00ff" intensity={1.8} />
        <pointLight position={[0, 0, 3]} color="#00ffff" intensity={8} distance={15} />
        {/* 操作性(舞う図でぐりぐり動かせる) */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={6}
          maxDistance={25}
          autoRotate
          autoRotateSpeed={0.15}
        />

      </Canvas>
    </div>
  )
}
