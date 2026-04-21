'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { Float, PresentationControls } from '@react-three/drei';
import { useRef } from 'react';
import  * as THREE from 'three';
import { useScrollStore } from '../../store/useScrollStore';



export function CyberModels() {
  const progress = useScrollStore((state) => state.progress);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // レスポンシブ対応：画面幅に応じてモデルのスケールを調整
  const isMobile = viewport.width < 5;
  const baseScene = isMobile ? 0.6 : 1;

  useFrame((state, delta) => {
    if(!groupRef.current) return;

    // スクロール進捗(0~1)に基づいて、Y軸の移動と回転を計算
    // lerpを使うことで、Lenisの動きにさらに３D特有の滑らかさを加える
    const targetY = progress * 10 // スクロールで上に移動
    const targetRotationX = progress * Math.PI;

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);

    // マウス視差(パララックス)効果
    const targetParallaxX = (state.pointer.x * viewport.width) / 10;
    const targetParallaxY = (state.pointer.y * viewport.height) / 10;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetParallaxX, 0.05);
  });

  return (
    <group ref={groupRef}>
      {/* モデル1：　ヒーローセクション用(ドラッグで回転可能) */}
      <PresentationControls
        global={false} // モデル上でのみドラック判定
        cursor={true}
        snap={true} // ハンスト元の角度に戻る
        speed={1.5}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[2, -2, 0]} scale={baseScene}>
            <torusKnotGeometry args={[1, 0.3, 128, 64]} />
            <meshStandardMaterial color="#ff0055" wireframe />
          </mesh>
        </Float>
      </PresentationControls>
      {/* モデル２： スクロール中盤用 */}
      <Float speed={4}>
        <mesh position={[-3, -8, -2]} scale={baseScene * 1.5}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  )
}
