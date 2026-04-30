// app/glsl-demo/RipplePlane.tsx
"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Vertex Shader ────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  varying vec2 vUv;        // ① vUv を fragment へ渡す
  varying float vElevation; // ② 頂点の高さも渡す（波紋の立体感用）

  uniform float uTime;

  // 擬似ノイズ（GLSLにはbuilt-inがないので自前定義）
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vUv = uv;

    // 中心からの距離で波紋の高さを計算
    float dist = length(position.xy);
    float wave = sin(dist * 6.0 - uTime * 2.5) * 0.08;
    wave *= smoothstep(2.0, 0.0, dist); // 端に向かってフェードアウト

    vElevation = wave;

    vec3 pos = position;
    pos.z += wave; // 頂点をZ方向に動かす

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─── Fragment Shader ───────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying float vElevation;

  uniform float uTime;
  uniform vec3 uColor;

  // 擬似スムーズノイズ（バイリニア補間）
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // 4隅のランダム値
    float a = fract(sin(dot(i,               vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1,0),   vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0,1),   vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1,1),   vec2(127.1, 311.7))) * 43758.5453);

    // smoothstep で滑らかに補間
    vec2 u = smoothstep(0.0, 1.0, f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;

    // ── ① ノイズ歪み ──────────────────────────────
    // UVをノイズでずらしてゆらぎを作る
    float nx = smoothNoise(uv * 4.0 + uTime * 0.3);
    float ny = smoothNoise(uv * 4.0 + vec2(5.2, 1.3) + uTime * 0.3);
    vec2 distortedUV = uv + vec2(nx, ny) * 0.06;

    // ── ② fract グリッド ──────────────────────────
    // fractで0-1を繰り返す → タイル化
    vec2 grid = fract(distortedUV * 8.0); // 8x8グリッド

    // グリッドの線（端が0 or 1に近いほど明るく）
    float lineX = smoothstep(0.95, 1.0, grid.x) + smoothstep(0.05, 0.0, grid.x);
    float lineY = smoothstep(0.95, 1.0, grid.y) + smoothstep(0.05, 0.0, grid.y);
    float gridLine = clamp(lineX + lineY, 0.0, 1.0);

    // ── ③ 波紋カラー ──────────────────────────────
    // vElevation（頂点の高さ）を色に反映
    float rippleColor = vElevation * 8.0 + 0.5; // -0.5〜1.5 くらいにスケール

    // ── ④ 合成 ────────────────────────────────────
    vec3 color = uColor * rippleColor;
    color += vec3(0.2, 0.5, 1.0) * gridLine * 0.6; // グリッド線をブルーで重ねる

    // 中心からのグロー
    float dist = length(vUv - 0.5) * 2.0;
    float glow = smoothstep(1.0, 0.0, dist);
    color += uColor * glow * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── Component ─────────────────────────────────────────────────────────────────
export default function RipplePlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime:  { value: 0 },
      uColor: { value: new THREE.Color("#7c3aed") },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* segmentsを増やすほど頂点変位が滑らか */}
      <planeGeometry args={[4, 4, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
