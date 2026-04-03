"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Text3D, ContactShadows, Center } from "@react-three/drei";
import { Physics, useBox } from "@react-three/cannon";
import * as THREE from "three";

// フォントURL (JSON形式)
const FONT_URL = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json";

// --- 1. 個別の文字コンポーネント ---
function PhysicsLetter({ char, initialPos, fontSize, color, mode }: any) {
  // 物理ボディの登録
  const [ref, api] = useBox(() => ({
    mass: 1, // 最初から質量1にする（反応を確実にするため）
    position: initialPos,
    args: [fontSize * 0.6, fontSize * 0.8, 0.2],
    collisionFilterGroup: mode === "fixed" ? 0 : 1, // 固定中は衝突判定を消す
  }), [initialPos]);

  // モード切替の監視
  useEffect(() => {
    if (mode === "falling") {
      api.collisionFilterGroup.set(1); // 衝突有効化
      api.wakeUp(); 
    } else if (mode === "fixed") {
      api.collisionFilterGroup.set(0); // 衝突無効化
      api.position.set(...initialPos);
      api.rotation.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    }
  }, [mode, api, initialPos]);

  // 戻るアニメーション (resetting)
  useFrame((state) => {
    if (mode === "resetting" && ref.current) {
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      
      const p = ref.current.position;
      const r = ref.current.rotation;

      api.position.set(
        THREE.MathUtils.lerp(p.x, initialPos[0], 0.1),
        THREE.MathUtils.lerp(p.y, initialPos[1], 0.1),
        THREE.MathUtils.lerp(p.z, initialPos[2], 0.1)
      );
      api.rotation.set(
        THREE.MathUtils.lerp(r.x, 0, 0.1),
        THREE.MathUtils.lerp(r.y, 0, 0.1),
        THREE.MathUtils.lerp(r.z, 0, 0.1)
      );
    }
  });

  return (
    <mesh ref={ref as any} castShadow>
      <Text3D
        font={FONT_URL}
        size={fontSize}
        height={0.2}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
      >
        {char}
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.7} />
      </Text3D>
    </mesh>
  );
}

// --- 2. 物理的な床 ---
function Floor() {
  useBox(() => ({ type: "Static", args: [20, 1, 10], position: [0, -3.5, 0] }));
  return null;
}

// --- 3. メインコンポーネント ---
export default function GravityPage() {
  const [mode, setMode] = useState<"fixed" | "falling" | "resetting">("fixed");

  // 文字の正確な中央配置ロジック
  const letters = useMemo(() => {
    const data: any[] = [];
    const title = "PHYSICS";
    const body = "INTERACTIVE";

    // タイトル (上段)
    const tSize = 0.8;
    const tGap = 0.65;
    const tOffset = ((title.length - 1) * tGap) / 2;
    title.split("").forEach((char, i) => {
      data.push({ 
        char, 
        initialPos: [i * tGap - tOffset, 1.5, 0], 
        fontSize: tSize, 
        color: "#00E5FF" // シアン
      });
    });

    // サブ (下段)
    const bSize = 0.4;
    const bGap = 0.35;
    const bOffset = ((body.length - 1) * bGap) / 2;
    body.split("").forEach((char, i) => {
      data.push({ 
        char, 
        initialPos: [i * bGap - bOffset, 0.3, 0], 
        fontSize: bSize, 
        color: "#FF0055" // ピンク
      });
    });

    return data;
  }, []);

  const handleToggle = () => {
    if (mode === "fixed") setMode("falling");
    else {
      setMode("resetting");
      setTimeout(() => setMode("fixed"), 1000);
    }
  };

  return (
    <main className="h-screen w-full bg-[#f8f9fa] relative overflow-hidden">
      {/* 画面上のボタン UI */}
      <div className="absolute top-12 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
        <button
          onClick={handleToggle}
          className="pointer-events-auto px-12 py-4 bg-black text-white text-[11px] font-black tracking-[0.4em] rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all uppercase"
        >
          {mode === "falling" ? "Reset Layout" : "Drop Everything"}
        </button>
      </div>

      <Canvas 
        shadows
        gl={{ antialias: true, shadowMapType: THREE.PCFShadowMap }} // 警告対策
        camera={{ position: [0, 0, 9], fov: 40 }}
      >
        <color attach="background" args={["#fcfcfc"]} />
        <ambientLight intensity={1.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />

        {/* 物理演算設定 */}
        <Physics gravity={[0, -15, 0]} iterations={15}>
          <Floor />
          {letters.map((l, i) => (
            <PhysicsLetter key={i} {...l} mode={mode} />
          ))}
        </Physics>

        {/* 接地時の柔らかな影 */}
        <ContactShadows 
          position={[0, -3.4, 0]} 
          opacity={0.3} 
          scale={20} 
          blur={3} 
          far={4} 
        />
        
        <Environment preset="city" />
      </Canvas>
    </main>
  );
}
