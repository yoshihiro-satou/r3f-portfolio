'use client';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ParticleSystem from "./ParticleSystem";


export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
      <ParticleSystem count={3000}/>
      <OrbitControls />
    </Canvas>
  );
}
