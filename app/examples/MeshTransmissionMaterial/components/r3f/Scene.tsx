// app/components/r3f/Scene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import GlassObject from "./GlassObject";
import SceneEnvironment from "./Environment";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0a0a0f"]} />
      <Suspense fallback={null}>
        <SceneEnvironment />
        <GlassObject />
      </Suspense>
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
