"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial, Center } from "@react-three/drei";
import * as THREE from "three";

// --- カスタムシェーダーの定義 ---
const InteractiveWaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uColorA: new THREE.Color("#050030"), // 深い紺
    uColorB: new THREE.Color("#00d4ff"), // 明るい青
  },
  // Vertex Shader: マウス位置に基づいて頂点を持ち上げる
  `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 基本的な波の計算
    float wave = sin(pos.x * 2.0 + uTime) * 0.1;
    wave += sin(pos.y * 3.0 + uTime * 0.5) * 0.1;

    // マウスとの距離を計算（マウスの影響範囲）
    float dist = distance(uv, uMouse);
    float mouseInfluence = smoothstep(0.4, 0.0, dist); // 0.4の範囲内で影響
    
    // マウスの近くを盛り上げる
    pos.z += wave + (mouseInfluence * 0.3);
    
    vElevation = pos.z; // Fragmentに高さを渡す

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // Fragment Shader: マウスの近くを明るく、高低差で色を変える
  `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main() {
    // マウスからの距離でスポットライト効果
    float dist = distance(vUv, uMouse);
    float light = smoothstep(0.5, 0.0, dist);

    // 高さ(vElevation)とスポットライトを組み合わせて色を混ぜる
    vec3 color = mix(uColorA, uColorB, vElevation * 2.0 + 0.5);
    color += light * 0.2; // マウスの周りを少し白く光らせる

    gl_FragColor = vec4(color, 1.0);
  }
  `
);

extend({ InteractiveWaveMaterial });

function BackgroundWave() {
  const materialRef = useRef<any>();

  useFrame((state) => {
    if (materialRef.current) {
      // 時間の更新
      materialRef.current.uTime = state.clock.getElapsedTime() * 0.5;

      // マウス座標をシェーダーのUV座標(0.0 ~ 1.0)に変換して渡す
      // state.mouse は -1 ~ 1 なので変換が必要
      const targetX = (state.mouse.x + 1) / 2;
      const targetY = (state.mouse.y + 1) / 2;

      // 線形補間(lerp)でマウスの動きを滑らかにする
      materialRef.current.uMouse.x = THREE.MathUtils.lerp(
        materialRef.current.uMouse.x,
        targetX,
        0.1
      );
      materialRef.current.uMouse.y = THREE.MathUtils.lerp(
        materialRef.current.uMouse.y,
        targetY,
        0.1
      );
    }
  });

  return (
    <mesh rotation={[-Math.PI / 3, 0, 0]} scale={[12, 12, 1]}>
      <planeGeometry args={[1, 1, 128, 128]} />
      {/* @ts-ignore */}
      <interactiveWaveMaterial ref={materialRef} />
    </mesh>
  );
}


// --- メインページコンポーネント ---
export default function ShaderPage() {
  return (
    <main className="relative h-screen w-full bg-slate-950 overflow-hidden text-white">
      {/* R3F 背景 */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <BackgroundWave />
        </Canvas>
      </div>

      {/* 前面コンテンツ */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center pointer-events-none">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mix-blend-screen opacity-90 uppercase">
            Interact<br />Motion
          </h1>
          
          <div className="max-w-xl mx-auto space-y-4 pointer-events-auto">
            <p className="text-blue-300 font-mono tracking-widest text-sm uppercase">
              Mouse-linked displacement shader
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              マウスを動かしてみてください。波の形状と光の反射が、あなたのカーソルを追従します。R3FとGLSLによる低遅延なインタラクション。
            </p>
            
            <div className="pt-8 flex gap-6 justify-center">
              <button className="group relative px-8 py-3 bg-cyan-500 font-bold rounded-sm transition-all hover:bg-white hover:text-cyan-600">
                GET STARTED
                <span className="absolute -bottom-2 -right-2 w-full h-full border border-cyan-500 -z-10 group-hover:bottom-0 group-hover:right-0 transition-all"></span>
              </button>
              <button className="px-8 py-3 border border-gray-700 hover:border-white transition-colors">
                DOCUMENT
              </button>
            </div>
          </div>
        </div>

        {/* 下部のステータスバー的な装飾 */}
        <div className="absolute bottom-8 w-full px-12 flex justify-between items-end hidden md:flex">
          <div className="space-y-1">
            <div className="h-[1px] w-32 bg-cyan-500/50"></div>
            <p className="text-[10px] font-mono text-cyan-500/50">SYSTEM READY / STABLE</p>
          </div>
          <p className="text-[10px] font-mono text-gray-600">
            SCROLL TO EXPLORE <br />
            BASED ON THREE.JS
          </p>
        </div>
      </div>
    </main>
  );
}
