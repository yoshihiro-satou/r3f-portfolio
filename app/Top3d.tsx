'use client'

import { CyberGridFloor } from '@/components/CyberGridFloor';
import { Canvas } from '@react-three/fiber';
import { InteractiveText } from '@/components/InteractiveText'

export default function Top3d() {
  return (
    <div style={{
      background: '#05050f',
      height: '100vh',
      width: '100vw',
    }}>
      <Canvas camera={{ position: [0, 2, 12], fov: 50}}>
        <InteractiveText>
          R3F{"\n"}SAMPLES
        </InteractiveText>
        <CyberGridFloor />
        <pointLight position={[-10, 8, 5]} color="#00ffff" intensity={2} />
        <pointLight position={[10,-5, 8]} color="#ff00ff" intensity={1.8} />
        <pointLight position={[0, 0, 3]} color="#00ffff" intensity={8} distance={15} />
      </Canvas>
    </div>
  );
}
