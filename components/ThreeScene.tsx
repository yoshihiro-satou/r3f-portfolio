'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function ThreeScene() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#05050f']} />

        <axesHelper args={[10]} />
        <gridHelper args={[20, 20, '#333333', '#222222']} />

        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff" 
            emissiveIntensity={1.5} 
          />
        </mesh>

        <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#112233" />
        </mesh>

        <ambientLight intensity={0.8} color="#112244" />
        <directionalLight position={[5, 10, 5]} intensity={3} color="#ffffff" />
        <pointLight position={[-15, 12, 8]} color="#00ffff" intensity={5} />
        <pointLight position={[15, -10, 10]} color="#ff00ff" intensity={4} />
        <pointLight position={[0, 5, 5]} color="#ffffff" intensity={8} />

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
