"use client"

import { useScroll, Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from 'react';
import * as THREE from 'three';

export default function Background() {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null!);

  useFrame(() => {
    // スクロールオフセット(0~1)に基づいて回転と色を制御
    const offset = scroll.offset;
    if(group.current) {
      group.current.rotation.y = offset * Math.PI * 2;
      group.current.position.y = -offset * 10 // スクロールに合わせて沈み込む
    }
  })
  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <torusGeometry args={[1, 0.4, 16, 100]} />
          <meshStandardMaterial color="#989af2" roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>
      <Text position={[0, 0, 2]} fontSize={0.5} color="white">
        Scroll Experience
      </Text>
    </group>
  )
}
