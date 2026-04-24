'use client'

import { Canvas } from '@react-three/fiber';
// import  RotatingBox  from './components/RotatingBox';
// import SpringBox from './components/SpringBox';
import { Suspense } from 'react';
import AnimatedModel from './components/AnimatedModel';
export default function page() {
  return (
    <div style={{ width: '100vw', height: '100vh'}}>
      <Canvas camera={{ position: [0, 1, 3]}}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <Suspense fallback={null}>
          <AnimatedModel />
        </Suspense>
      </Canvas>
    </div>
  )
}
