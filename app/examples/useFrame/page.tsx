'use client'

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RotatingModel from './components/RotatingModel';

export default function page() {
  return (
    // Canvasの高さは親要素に依存するので、親にheightを指定する
    <div style={{ width: '100vw', height: '100vh'}}>
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        
        <RotatingModel url={'/models/Orion.glb'} />
        {/* マウスでぐりぐり動かせる。autoRotateと競合するので注意 */}
        <OrbitControls />
      </Canvas>
    </div>
  )
}
