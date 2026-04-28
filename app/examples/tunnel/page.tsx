"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ============================================================
// 🎯 ポイント①：トンネルのパスをメモ化して共有する
//    useMemo で一度だけ生成。CameraRig と Tunnel の両方が同じ曲線を使う。
// ============================================================
function useTunnelCurve() {
  return useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(2, 1, -10),
        new THREE.Vector3(-2, -1, -20),
        new THREE.Vector3(1, 2, -30),
        new THREE.Vector3(0, 0, -50),
      ]),
    []
  );
}

// ============================================================
// 🎯 ポイント②：Math.random はモジュールスコープの IIFE で生成
//    レンダー中に呼ぶと ESLint(react-hooks/purity) に引っかかるため。
// ============================================================
const PARTICLE_COUNT = 300;
const particlePositions = (() => {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 3.5;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
    arr[i * 3 + 2] = -Math.random() * 50;
  }
  return arr;
})();

// ============================================================
// カメラリグ：スクロール量でカメラをパスに沿って動かす
// ============================================================
function CameraRig() {
  const scroll = useScroll();
  const curve = useTunnelCurve();

  useFrame((state) => {
    const t = scroll.offset; // 0〜1
    const tNext = Math.min(t + 0.01, 1);
    state.camera.position.copy(curve.getPoint(t));
    state.camera.lookAt(curve.getPoint(tNext));
  });

  return null;
}

// ============================================================
// トンネル本体
// ============================================================
function Tunnel() {
  const curve = useTunnelCurve();
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 200, 2, 8, false),
    [curve]
  );

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#1a0533"
        side={THREE.BackSide}
        emissive="#3b0764"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// ============================================================
// パーティクル（光の粒）
// ============================================================
function Particles() {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c084fc"
        emissive="#c084fc"
        // ↓ pointsMaterial に emissive はないが、THREE.PointsMaterial は
        //   color が明るければ Bloom が拾う。色を明るく設定するだけでOK。
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// ============================================================
// 🎯 ポイント③（今回のメイン）：Bloom をスクロール量に連動させる
//
//    useRef で BloomEffect インスタンスを参照し、
//    useFrame 内で scroll.offset に応じて intensity を毎フレーム更新する。
//
//    - scroll.offset = 0（トップ）  → intensity 弱め（0.5）
//    - scroll.offset = 1（ボトム）  → intensity 強め（4.0）
//
//    THREE.MathUtils.lerp(a, b, t) で a〜b の間をスムーズに補間する。
// ============================================================
function BloomController() {
  const scroll = useScroll();
  // BloomEffect の型は @react-three/postprocessing から import できるが、
  // ここでは any で簡略化（型を厳密にしたい場合は SelectiveBloom 等を参照）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bloomRef = useRef<any>(null);

  useFrame(() => {
    if (!bloomRef.current) return;
    const t = scroll.offset; // 0〜1

    // lerp(最小値, 最大値, スクロール量) でスムーズに変化
    bloomRef.current.intensity = THREE.MathUtils.lerp(0.5, 5.0, t);
  });

  return (
    <EffectComposer>
      <Bloom
        ref={bloomRef}
        intensity={0.5}          // 初期値（useFrame で上書きされる）
        luminanceThreshold={0.2} // この輝度以上にBloomをかける
        luminanceSmoothing={0.9}
      />
    </EffectComposer>
  );
}

// ============================================================
// Scene：ScrollControls の内側に置くコンポーネントをまとめる
//         BloomController は ScrollControls の外でもOKだが、
//         useScroll を使うため内側に置く必要がある。
// ============================================================
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <CameraRig />
      <Tunnel />
      <Particles />
      {/*
        🎯 ポイント④：EffectComposer（BloomController）は ScrollControls の
        内側に置いてよい。ただし ScrollControls の直接の子は <Scroll> か
        通常の R3F コンポーネントである必要がある。
        useScroll() を使うコンポーネントは ScrollControls の子孫である必要がある。
      */}
      <BloomController />
    </>
  );
}

// ============================================================
// Page：Canvas と ScrollControls のルート
// ============================================================
export default function Page() {
  return (
    <main style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas camera={{ fov: 75, near: 0.1, far: 100 }}>
        {/*
          pages={5}：スクロール量を5画面分に設定。
          増やすとゆっくり進む、減らすと速く進む。
          damping={0.3}：慣性。小さいほどスクロールがキビキビ動く。
        */}
        <ScrollControls pages={5} damping={0.3}>
          <Scene />
        </ScrollControls>
      </Canvas>

      {/* スクロールヒント（R3F の外側、通常の HTML） */}
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#a855f7",
          fontSize: "0.875rem",
          letterSpacing: "0.1em",
          opacity: 0.7,
          pointerEvents: "none",
          fontFamily: "monospace",
        }}
      >
        SCROLL TO DIVE ↓
      </div>
    </main>
  );
}
