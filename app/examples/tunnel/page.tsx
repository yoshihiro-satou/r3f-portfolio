"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ============================================================
// 🎯 GLSL ① vertexShader
//    - 頂点の位置を決める（今回は変形なし、そのままパススルー）
//    - vUv：UV座標をfragmentShaderに渡すための varying
// ============================================================
const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ============================================================
// 🎯 GLSL ② fragmentShader
//    - ピクセルの色を決める（今回のメイン）
//    - texture2D()：サンプラーからUV座標のピクセル色を取得
//    - mix()：2色を補間（lerp の GLSL 版）
//    - uTime：JS から毎フレーム送られる時間値（揺らぎ演出に使用）
// ============================================================
const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;   // テクスチャ
  uniform vec3 uColor;      // 乗算カラー（紫〜青系）
  uniform float uTime;      // 経過時間
  uniform float uScroll;    // スクロール量（0〜1）

  varying vec2 vUv;

  void main() {
    // ① UV を時間でわずかにずらして「揺らぎ」を作る
    vec2 uv = vUv;
    uv.x += sin(uv.y * 8.0 + uTime * 0.3) * 0.008;

    // ② テクスチャのピクセル色を取得
    vec4 texColor = texture2D(uMap, uv);

    // ③ テクスチャカラー × uColor で色を染める
    vec3 tinted = texColor.rgb * uColor;

    // ④ スクロールが進むほど明るくなる（発光感）
    float brightness = 1.0 + uScroll * 1.5;
    tinted *= brightness;

    gl_FragColor = vec4(tinted, texColor.a);
  }
`;

// ============================================================
// カスタムフック：トンネル曲線（前回と同じ）
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
// パーティクル座標（前回と同じ）
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
// カメラリグ（前回と同じ）
// ============================================================
function CameraRig() {
  const scroll = useScroll();
  const curve = useTunnelCurve();
  useFrame((state) => {
    const t = scroll.offset;
    const tNext = Math.min(t + 0.01, 1);
    state.camera.position.copy(curve.getPoint(t));
    state.camera.lookAt(curve.getPoint(tNext));
  });
  return null;
}

// ============================================================
// 🎯 ポイント③：ShaderMaterial でトンネルを描画
//
//    uniforms：JS → GLSL へ値を渡す橋
//    useRef で material を参照し、useFrame で毎フレーム uTime / uScroll を更新
// ============================================================
function Tunnel() {
  const rawTexture = useTexture("/textures/stone_wall.jpg");

  const texture = useMemo(() => {
    const t = rawTexture.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(5, 10);
    t.needsUpdate = true;
    return t;
  }, [rawTexture]);

  // uniforms をメモ化（毎レンダーで再生成しないため）
  const uniforms = useMemo(
    () => ({
      uMap:    { value: texture },
      uColor:  { value: new THREE.Color("#7c3aed") }, // 紫
      uTime:   { value: 0 },
      uScroll: { value: 0 },
    }),
    [texture]
  );

  // material の ref（useFrame 内で uniform を更新するため）
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const scroll = useScroll();

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    // 🎯 uniform の値を毎フレーム更新
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uScroll.value = scroll.offset;
  });

  const curve = useTunnelCurve();
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 200, 2, 8, false),
    [curve]
  );

  return (
    <mesh geometry={geometry}>
      {/* 🎯 shaderMaterial で独自シェーダーを適用 */}
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// ============================================================
// パーティクル（前回と同じ）
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
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// ============================================================
// BloomController（前回と同じ）
// ============================================================
function BloomController() {
  const scroll = useScroll();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bloomRef = useRef<any>(null);
  useFrame(() => {
    if (!bloomRef.current) return;
    bloomRef.current.intensity = THREE.MathUtils.lerp(0.5, 5.0, scroll.offset);
  });
  return (
    <EffectComposer>
      <Bloom
        ref={bloomRef}
        intensity={0.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
      />
    </EffectComposer>
  );
}

// ============================================================
// Scene
// ============================================================
function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <CameraRig />
      <Tunnel />
      <Particles />
      <BloomController />
    </>
  );
}

// ============================================================
// Page
// ============================================================
export default function Page() {
  return (
    <main style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas camera={{ fov: 75, near: 0.1, far: 100 }}>
        <ScrollControls pages={5} damping={0.3}>
          <Scene />
        </ScrollControls>
      </Canvas>
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
