// app/components/r3f/Environment.tsx
"use client";

import { Environment } from "@react-three/drei";

// ガラスの「透過先」として見える背景オブジェクト群
function BackgroundObjects() {
  return (
    <>
      {/* カラフルな球体を背面に配置 → ガラス越しに歪んで見える */}
      <mesh position={[-2, 1, -3]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#ff6b6b" roughness={0.2} />
      </mesh>
      <mesh position={[2, -0.5, -3]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#4ecdc4" roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.5, -2.5]}>
        <torusGeometry args={[0.8, 0.3, 16, 32]} />
        <meshStandardMaterial color="#a8edea" roughness={0.1} />
      </mesh>
      {/* 発光する平面（ガラス越しのグロー効果に貢献） */}
      <mesh position={[0, 0, -4]} rotation={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#16213e"
          emissiveIntensity={0.5}
        />
      </mesh>
    </>
  );
}

export default function SceneEnvironment() {
  return (
    <>
      {/* drei/Environment: IBL（Image-Based Lighting）
          MeshTransmissionMaterial は envMap が必須に近い */}
      <Environment preset="city" />

      {/* 補助ライト */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-3, 2, 2]} intensity={2} color="#6c63ff" />

      <BackgroundObjects />
    </>
  );
}
