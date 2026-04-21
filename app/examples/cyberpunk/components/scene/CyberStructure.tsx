'use client';

import { Float } from '@react-three/drei';

export function CyberStructure() {
  // ネオンカラーの定義
  const neonBlue = '#00ffff';
  const neonPink = '#ff0055';
  const neonGold = '#ffcc00';

  return (
    <group>
      {/* 浮遊感を出す */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>

        {/* 外側：大きなリング(ゴールド) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4, 0.05, 16, 100]} />
          <meshStandardMaterial
            color={neonGold}
            emissive={neonGold}
            emissiveIntensity={4}
            wireframe
          />
        </mesh>

        {/* 中央：複雑な重なり(ブルー) */}
        <mesh position={[0, 0, 0]} rotation={[0,Math.PI / 4, 0]}>
          <torusGeometry args={[1.5, 0.3, 200, 32]} />
          <meshStandardMaterial
            color={neonBlue}
            emissive={neonBlue}
            emissiveIntensity={4} // 強く光らせる
          />
        </mesh>

        {/* 内側：回転するリング(ピンク) */}
        {/* <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
          <torusGeometry args={[2.5, 0.1, 8, 80]} />
          <meshStandardMaterial
            color={neonPink}
            emissive={neonPink}
            emissiveIntensity={5}
            wireframe
          />
        </mesh> */}

        {/* 中心点：光の源 */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color={neonPink} />
        </mesh>
      </Float>
    </group>
  )
}
