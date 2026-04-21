// components/scene/CameraController.tsx
'use client';

import { useFrame } from '@react-three/fiber';
import { useScrollStore } from '../../store/useScrollStore';
import * as THREE from 'three';

export function CameraController() {
  useFrame((state) => {
    const progress = useScrollStore.getState().progress;

    // カメラのZ座標（スクロールで奥へ進む）
    const targetZ = THREE.MathUtils.mapLinear(progress, 0, 1, 45, -45);
    
    // 滑らかな移動
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    
    // カメラの視線（常に少し先を見る）
    state.camera.lookAt(0, 0, state.camera.position.z - 10);
  });

  return null;
}
