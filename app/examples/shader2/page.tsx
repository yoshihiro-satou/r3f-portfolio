"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- 1. カラーパレット ---
const THEMES = [
  { a: "#050030", b: "#00d4ff", name: "Deep Ocean" },
  { a: "#20002c", b: "#cbb4d4", name: "Twilight" },
  { a: "#0f2027", b: "#2c5364", name: "Midnight" },
  { a: "#134e5e", b: "#71b280", name: "Forest Rain" },
  { a: "#500000", b: "#ff3e00", name: "Magma" },
];

// --- 2. カスタムシェーダー ---
const InteractiveWaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5), // UV座標 (0.0 ~ 1.0)
    uColorA: new THREE.Color(THEMES[0].a),
    uColorB: new THREE.Color(THEMES[0].b),
  },
  `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 波の基本計算
    float wave = sin(pos.x * 3.0 + uTime) * 0.1;
    wave += sin(pos.y * 2.0 + uTime * 0.8) * 0.1;

    // マウス位置 (uMouse) と現在の頂点 (uv) の距離
    // uMouseはメッシュ上の 0.0~1.0 の座標として渡される
    float dist = distance(uv, uMouse);
    float mouseInfluence = smoothstep(0.4, 0.0, dist);
    
    pos.z += wave + (mouseInfluence * 0.8); // 盛り上がりを強調
    
    vElevation = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  `
  varying vec2 vUv;
  varying float vElevation;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec2 uMouse;

  void main() {
    vec3 color = mix(uColorA, uColorB, vElevation * 1.5 + 0.3);
    float light = smoothstep(0.3, 0.0, distance(vUv, uMouse));
    color += light * 0.3; // マウス位置を光らせる
    gl_FragColor = vec4(color, 1.0);
  }
  `
);

extend({ InteractiveWaveMaterial });

// --- 3. 背景コンポーネント ---
function BackgroundWave({ themeIndex }: { themeIndex: number }) {
  const materialRef = useRef<any>();
  
  // マウスの目標UV座標を保持するRef（初期値は中央）
  const mouseUV = useRef(new THREE.Vector2(0.5, 0.5));

  const targetColorA = useMemo(() => new THREE.Color(THEMES[themeIndex].a), [themeIndex]);
  const targetColorB = useMemo(() => new THREE.Color(THEMES[themeIndex].b), [themeIndex]);

  useFrame((state) => {
    if (!materialRef.current) return;

    // 時間更新
    materialRef.current.uTime = state.clock.getElapsedTime() * 0.5;

    // マウス座標を滑らかに補間 (Lerp)
    materialRef.current.uMouse.lerp(mouseUV.current, 0.1);

    // 色を滑らかに補間
    materialRef.current.uColorA.lerp(targetColorA, 0.05);
    materialRef.current.uColorB.lerp(targetColorB, 0.05);
  });

  return (
    <mesh 
      rotation={[-Math.PI / 3, 0, 0]} 
      scale={[20, 20, 1]}
      // ★ ここが最重要：メッシュ上でのマウス位置（UV）を直接取得する
      onPointerMove={(e) => {
        if (e.uv) mouseUV.current.copy(e.uv);
      }}
    >
      <planeGeometry args={[1, 1, 128, 128]} />
      {/* @ts-ignore */}
      <interactiveWaveMaterial ref={materialRef} />
    </mesh>
  );
}

// --- 4. メインページ ---
export default function ShaderPage() {
  const [themeIndex, setThemeIndex] = useState(0);

  return (
    <main className="relative h-screen w-full bg-slate-950 overflow-hidden text-white font-sans">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <BackgroundWave themeIndex={themeIndex} />
        </Canvas>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center pointer-events-none select-none">
        <div className="text-center space-y-4">
          <p className="text-cyan-400 font-mono tracking-[0.4em] text-[10px] uppercase animate-pulse">
            Raycasting Enabled
          </p>
          <h1 className="text-7xl md:text-[100px] font-black leading-none tracking-tighter mix-blend-screen opacity-80">
            SURFACE<br />WAVE
          </h1>
          <p className="text-slate-400 text-sm max-w-xs mx-auto font-light leading-relaxed px-6">
            プレーン上をなぞってください。波が指先に吸い付くように反応します。
          </p>
        </div>

        <div className="absolute bottom-12 flex flex-col items-center gap-6 pointer-events-auto">
          <div className="flex gap-4">
            {THEMES.map((theme, i) => (
              <button
                key={i}
                onClick={() => setThemeIndex(i)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i === themeIndex ? 'bg-cyan-400 scale-150 shadow-[0_0_10px_#22d3ee]' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={() => setThemeIndex((themeIndex + 1) % THEMES.length)}
            className="px-8 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white hover:text-black transition-all text-[10px] font-bold tracking-widest uppercase"
          >
            Switch Visuals
          </button>
        </div>
      </div>
    </main>
  );
}
