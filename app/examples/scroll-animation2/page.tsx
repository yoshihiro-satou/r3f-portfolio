"use client"

import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import  Background  from './components/background';
import Overlay from './components/Overlay';

export default function Page() {
  return (
    <div className="h-screen ww-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} >
        <color attach="background" args={['#575454']} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[0, 5, 5]} intensity={2} />
        {/* ScrollControlsで4ページ分(pages{4})のスクロール範囲を定義 */}
        <ScrollControls pages={4} damping={0.2} >
          <Background />
          <Scroll html>
            <Overlay />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  )
}
