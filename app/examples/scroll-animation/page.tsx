"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, MeshDistortMaterial, Icosahedron, Float, Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { useRef} from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import * as THREE from "three";

function CyberGeometry({ scrollYProgress }: { scrollYProgress: any }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const material = useRef(null!);

  // 0.8以降で急激に動きを加速させるための変換
  const rotationSpeed = useTransform(scrollYProgress, [0, 1], [1, 10]);
  const distortion = useTransform(scrollYProgress, [0, 1], [0.3, 1.5]);

  useFrame(() => {
    const r = scrollYProgress.get();
    
    // 派手な回転と、終盤に向けて歪みを加速
    mesh.current.rotation.x = r * rotationSpeed.get();
    mesh.current.rotation.y = r * rotationSpeed.get() * 0.5;
    
    material.current.distort = distortion.get();
    material.current.speed = 2 + r * 10; // スクロールで変形速度が加速
  });

  return (
    <Icosahedron ref={mesh} args={[1.5, 30]}>
      <MeshDistortMaterial
        ref={material}
        color="#00f3ff" // シアン（サイバー感）
        emissive="#00f3ff"
        emissiveIntensity={2}
        wireframe // デジタル感が出るワイヤーフレーム
        roughness={0}
        metalness={1}
      />
    </Icosahedron>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  return (
    <main className="relative bg-[#050505] text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} color="#ff00ff" intensity={5} />
          
          <Float speed={2} rotationIntensity={0.5}>
            <CyberGeometry scrollYProgress={smoothProgress} />
          </Float>

          <EffectComposer>
            <Bloom luminanceThreshold={0.1} intensity={2} mipmapBlur />
            <Noise opacity={0.1} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="relative z-10 w-full space-y-[100vh]">
        <section className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-8xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Digital Core
          </h1>
        </section>
        <section className="h-screen flex items-center justify-end pr-20">
          <h2 className="text-6xl font-bold uppercase">Real-time <br/> Rendering</h2>
        </section>
        <section className="h-screen flex items-center justify-center">
            {/* 終盤はここで最も派手に */}
          <h2 className="text-8xl font-black uppercase tracking-widest text-cyan-400">System Overload</h2>
        </section>
      </div>
    </main>
  );
}
