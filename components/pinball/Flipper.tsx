"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function Flipper({ position, isLeft }: { position: [number, number, number]; isLeft: boolean }) {
  const ref = useRef<RapierRigidBody>(null);
  const[isPressed, setIsPressed] = useState(false);

  // ① キーボードが押されたか・離されたかを監視する仕組み
  useEffect(() => {
    const key = isLeft ? "ArrowLeft" : "ArrowRight";
    
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === key) setIsPressed(true); };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.key === key) setIsPressed(false); };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  },[isLeft]);

  // ② 毎フレーム（1秒間に60回）、フリッパーの角度を計算して反映する
  useFrame(() => {
    if (!ref.current) return;
    
    // 押されている時は上向きに、離されている時は下向きに角度（ラジアン）を設定
    const pressedAngle = isLeft ? 0.5 : -0.5;
    const releasedAngle = isLeft ? -0.5 : 0.5;
    const targetAngle = isPressed ? pressedAngle : releasedAngle;

    // 角度を物理エンジンに伝えて、無理やり回転させます（キネマティックな動き）
    const euler = new THREE.Euler(0, 0, targetAngle);
    const quaternion = new THREE.Quaternion().setFromEuler(euler);
    ref.current.setNextKinematicRotation(quaternion);
  });

  return (
    <RigidBody ref={ref} type="kinematicPosition" position={position}>
      {/* 
        ★ここがゲーム開発の小技！★
        そのまま回転させると「真ん中」を中心に回ってしまいます。
        meshのpositionを少し横にズラすことで、「端っこ」を中心に回転しているように見せています。
      */}
      <mesh position={[isLeft ? 1.5 : -1.5, 0, 0]}>
        <boxGeometry args={[3, 0.5, 1]} />
        {/* 押した時に色が光るようにすると、操作感が出ます！ */}
        <meshStandardMaterial color={isPressed ? "yellow" : "orange"} />
      </mesh>
    </RigidBody>
  );
}
