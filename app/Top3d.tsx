'use client'

import { CyberGridFloor } from '@/components/CyberGridFloor';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { InteractiveText } from '@/components/InteractiveText'
import * as THREE from 'three'

export default function Top3d() {
  return (
    <div style={{
      background: '#05050f',
      height: '100vh',
      width: '100vw',
    }}>
      <Canvas camera={{ position: [0, 2, 12], fov: 50}}>
        <SceneAdjuster />

        <InteractiveText>
          R3F{"\n"}SAMPLES
        </InteractiveText>
        <CyberGridFloor />
      </Canvas>
    </div>
  );
}

// CAnvas内部専用の調整コンポーネント
function SceneAdjuster() {
  const { viewport, size, camera } = useThree()
  const isMobile = size.width < 768
  const targetCameraZ = isMobile ? 16 : 12
  const targetFov = isMobile ? 60 : 50
  const textScale = Math.min(viewport.width * 0.28, 3.8)

  useFrame(() => {
    // カメラZをスムーズに追従
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetCameraZ,
      0.08
    )

    // FOV変更時は updateProjectionMatrix を呼ぶ
    if(Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.08)
      camera.updateMatrix()
    }
  })

  return null
}
