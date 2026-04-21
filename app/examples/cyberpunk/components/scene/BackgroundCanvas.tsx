// components/scene/BackgroundCanvas.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Stage } from '@react-three/drei';
import { CyberStructure } from './CyberStructure';
import { MatrixTunnel } from './shaders/MatrixBackground';
import { CameraController } from './CameraController';

export default function BackgroundCanvas() {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: false }}>
      {/* PerspectiveCameraタグをここに書かないこと！
         CameraControllerがR3Fのデフォルトカメラを直接制御します。
      */}

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={2.0} />

      <Stage intensity={0.5} environment="night" adjustCamera={false}>
         <CyberStructure />
      </Stage>

      <MatrixTunnel />
      <CameraController />
    </Canvas>
  );
}
