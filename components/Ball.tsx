"use client"

import { RigidBody, RapierRigidBody } from "@react-three/rapier"
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

type Props = {
  position: [number, number, number];
  onFall?: () => void;
  ballKey?: number;
};

export default function Ball({ position, onFall, ballKey }: Props){
  const ref = useRef<RapierRigidBody | null>(null);

  // 毎フレームボールの高さをチェックして、下に落ちたら onFall を呼ぶ
  useFrame(() => {
    if (!ref.current) return;
    try {
      const t = ref.current.translation();
      if (t && t.y < -8) {
        onFall && onFall();
      }
    } catch (e) {
      // ignore
    }
  });

  return (
    <RigidBody key={ballKey} ref={ref} type="dynamic" position={position} restitution={0.8} colliders="ball" ccd>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
    </RigidBody>
  )
}
