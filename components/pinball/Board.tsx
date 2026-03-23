"use Client"

import { RigidBody } from "@react-three/rapier"

export default function Board() {
  return (
    <>
      {/* 左の壁 */}
      <RigidBody type="fixed" restitution={0.2}>
        <mesh position={[-10, 0, 0]}>
          <boxGeometry args={[1, 15, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>

      {/* 右の壁 */}
      <RigidBody type="fixed" restitution={0.2}>
        <mesh position={[10, 0, 0]}>
          <boxGeometry args={[1, 15, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>

      {/* ピンボールっぽさを出す。「バンパー（障害物）」 */}
      {/* restitution（反発係数）を大きくすると、当たったボールが強くはじかれる */}
      <RigidBody type="fixed" restitution={2}>
        <mesh position={[3, 2, 0]}>
          <cylinderGeometry args={[1, 1, 1, 32]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" restitution={2}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1, 1, 1, 32]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RigidBody>

      {/* 上部のフタ: ボールが画面外に出ないようにする */}
      <RigidBody type="fixed" restitution={0.2}>
        <mesh position={[0, 8.5, 0]}>
          <boxGeometry args={[22, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
    </>
  )
}
