'use client';

import { useRef, useState } from "react";
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export default function RotatingBox() {
  const meshRef = useRef<Mesh>(null);
  const[speed, setSpeed] = useState(1)

  useFrame((state, delta) => {
    if(!meshRef.current) return
    meshRef.current.rotation.y += delta * speed// deltaは善フレームからの秒数
  })

  return (
    <mesh 
      ref={meshRef}
      onClick={() => setSpeed(s => s + 1)} // クリックで加速
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  )
}
