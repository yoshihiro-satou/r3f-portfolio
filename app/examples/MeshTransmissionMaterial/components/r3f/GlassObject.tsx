// app/components/r3f/GlassObject.tsx
"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, useFBO } from "@react-three/drei";
import * as THREE from "three";

export default function GlassObject() {
  const meshRef = useRef<THREE.Mesh>(null!);

  // ---- useFBO: フレームバッファオブジェクト ----
  // MeshTransmissionMaterial が「背面を撮影」するために使う
  // samples=8 でMSAA（マルチサンプリング）→ 滑らかなガラスエッジ
  const fbo = useFBO({ samples: 8 });

  // ホバーで液体↔ガラスを切り替えるデモ
  const [isLiquid, setIsLiquid] = useState(false);

  // 毎フレームでゆっくり回転
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
  });

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => setIsLiquid(true)}
      onPointerLeave={() => setIsLiquid(false)}
    >
      {/* トーラスノットはガラスの歪みが一番映える */}
      <torusKnotGeometry args={[1, 0.35, 200, 32]} />

      {/*
        MeshTransmissionMaterial の主要パラメータ解説:

        transmission={1}        → 透過率。1=完全透過（ガラス）
        thickness={0.5}         → 内部の屈折厚み。大きいほど歪む
        roughness={0}           → 表面粗さ。0=鏡面、1=曇りガラス
        chromaticAberration     → 色収差（光の色分散）。ガラスらしさ↑
        anisotropy              → 異方性反射（液体感に効く）
        distortion              → 表面の歪み量（液体のゆらぎ）
        distortionScale         → 歪みのスケール
        temporalDistortion      → 時間軸の歪み（アニメーション）
        ior                     → 屈折率。水=1.33, ガラス=1.5, ダイヤ=2.4
        backside                → 裏面レンダリング（厚みの表現に必要）
      */}
      <MeshTransmissionMaterial
        buffer={fbo.texture}  // ← useFBO の結果を渡す（必須）

        // --- ガラスモード ---
        transmission={1}
        thickness={isLiquid ? 1.5 : 0.5}
        roughness={isLiquid ? 0.05 : 0}

        // --- 色収差（虹色の縁取り）---
        chromaticAberration={isLiquid ? 0.05 : 0.15}

        // --- 液体らしいゆらぎ ---
        distortion={isLiquid ? 0.5 : 0.1}
        distortionScale={isLiquid ? 0.5 : 0.2}
        temporalDistortion={isLiquid ? 0.3 : 0.05}

        // --- 屈折率 ---
        ior={isLiquid ? 1.33 : 1.5}  // 水 / ガラス

        // --- 色 ---
        color={isLiquid ? "#a8edea" : "#ffffff"}

        // --- 裏面も描画（立体感のある厚み表現）---
        backside={true}
        backsideThickness={0.3}
        backsideRoughness={0}

        // --- サンプル数（品質・重さのトレードオフ）---
        samples={isLiquid ? 16 : 8}

        // --- 環境マップの反射強度 ---
        envMapIntensity={1.5}
      />
    </mesh>
  );
}
