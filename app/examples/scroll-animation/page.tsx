"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Float, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";

function Scene() {
  const scroll = useScroll();
  const group = useRef<any>();

  // スクロールに合わせて回転とズームを行う
  useFrame((state, delta) => {
    const r = scroll.offset;
    group.current.rotation.y = r * Math.PI * 2;
    group.current.position.z = r * 5; 
  });

  return (
    <group ref={group}>
      <Float speed={2} floatIntensity={2}>
        <mesh>
          <torusGeometry args={[1.5, 0.4, 16, 100]} />
          <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Home() {
  return (
    // 1. 親要素は relative で高さを確保
    <main className="relative w-full ">
      
      {/* 2. Canvasは fixed で背景に固定 */}
      <div className="fixed inset-0 h-screen w-full -z-10 bg-black">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {/* ScrollControlsをCanvas内に配置 */}
          <ScrollControls pages={3} damping={0.2}>
            <Scene />
          </ScrollControls>
        </Canvas>
      </div>

      {/* 3. コンテンツは Canvas の上にオーバーレイ */}
      <div className="relative z-10 text-white">
        <section className="h-screen flex items-center p-20">
          <h1 className="text-8xl font-black uppercase">Gaming<br/>Engine</h1>
        </section>
        <section className="h-screen flex items-center p-20 justify-end">
          <div className="max-w-md bg-white/10 p-8 backdrop-blur-md rounded-xl">
            <h2 className="text-4xl font-bold">Immersive Worlds</h2>
            <p className="mt-4">Next.js + R3Fで実現する次世代の体験。</p>
          </div>
        </section>
        <section className="h-screen flex items-center p-20">
          <h2 className="text-4xl font-bold">Ready to Start?</h2>
        </section>
      </div>
    </main>
  );
}
