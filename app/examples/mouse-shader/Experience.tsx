// app/mouse-shader/Experience.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import MouseRipplePlane from "./MouseRipplePlane";

export default function Experience() {
  return (
    <Canvas
      camera={{ position: [0, 3, 5], fov: 50 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#050510"]} />
      <MouseRipplePlane />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
