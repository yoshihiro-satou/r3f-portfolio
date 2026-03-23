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

  // モバイル/タッチ対応: 画面の左右どちらを押したかでフリッパーを操作
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const x = e.clientX;
      const w = window.innerWidth;
      if (isLeft && x < w / 2) setIsPressed(true);
      if (!isLeft && x >= w / 2) setIsPressed(true);
    };
    const handlePointerUp = () => setIsPressed(false);

    const handleTouchStart = (e: TouchEvent) => {
      const x = e.touches[0]?.clientX;
      if (x === undefined) return;
      const w = window.innerWidth;
      if (isLeft && x < w / 2) setIsPressed(true);
      if (!isLeft && x >= w / 2) setIsPressed(true);
    };
    const handleTouchEnd = () => setIsPressed(false);

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isLeft]);

  // ② 毎フレーム、角速度を設定して回転させる（kinematicVelocity を使用）
  useFrame((_, dt) => {
    if (!ref.current) return;

    // 押されている時は上向きに、離されている時は下向きに角度（ラジアン）を設定
    const pressedAngle = isLeft ? 0.5 : -0.5;
    const releasedAngle = isLeft ? -0.5 : 0.5;
    const targetAngle = isPressed ? pressedAngle : releasedAngle;

    // 現在の回転を取得して z 成分（回転角）を求める
    const r = ref.current.rotation();
    const currentQuat = new THREE.Quaternion(r.x, r.y, r.z, r.w);
    const currentEuler = new THREE.Euler().setFromQuaternion(currentQuat);
    const currentZ = currentEuler.z;

    // 目標角度との差から必要な角速度を計算
    let angleDiff = targetAngle - currentZ;
    // 正規化 (-PI .. PI)
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    const maxAngVel = 20; // ラジアン/秒（安全な上限）
    const desiredAngVel = angleDiff / Math.max(dt, 1e-6);
    const angVelZ = Math.max(-maxAngVel, Math.min(maxAngVel, desiredAngVel));

    // Rapier に角速度を伝える（kinematicVelocity では速度ベースで移動するため衝突が正しく計算される）
    ref.current.setAngvel({ x: 0, y: 0, z: angVelZ }, true);

    // 目標角度に近づいたら速度を止めて角度をスナップ
    if (Math.abs(angleDiff) < 0.01) {
      ref.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
      const euler = new THREE.Euler(0, 0, targetAngle);
      const quaternion = new THREE.Quaternion().setFromEuler(euler);
      ref.current.setNextKinematicRotation(quaternion);
    }
  });

  return (
    <RigidBody ref={ref} type="kinematicVelocity" position={position}>
      {/* 
        ★ここがゲーム開発の小技！★
        そのまま回転させると「真ん中」を中心に回ってしまいます。
        meshのpositionを少し横にズラすことで、「端っこ」を中心に回転しているように見せています。
      */}
      {/* メッシュの中心をオブジェクトの外側にずらして、回転軸を端にする */}
      <mesh position={[isLeft ? 1 : -1, -1, 0]}>
        <boxGeometry args={[7, 0.5, 1]} />
        {/* 押した時に色が光るようにすると、操作感が出ます！ */}
        <meshStandardMaterial color={isPressed ? "yellow" : "orange"} />
      </mesh>
    </RigidBody>
  );
}
