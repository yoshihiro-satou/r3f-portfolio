"use client"

import { RigidBody } from "@react-three/rapier"

export default function Ball({ position }: { position: [number, number, number] }){
  return (
    // collider="Ball" で、当たり判定を完璧な球体にする
    // restitution={0.8}で、スーパーボールのようによく跳ねるようにする
    <RigidBody type="dynamic" position={position} restitution={0.8} colliders="ball">
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
    </RigidBody>
  )

}
