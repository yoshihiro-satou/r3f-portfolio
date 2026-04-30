// app/particle-demo/ParticleSystem.tsx
"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Vertex Shader ────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  // JS側のBufferAttributeから頂点ごとのサイズを受け取る
  attribute float aSize;

  uniform float uTime;
  uniform float uPixelRatio; // 高解像度ディスプレイ対応

  // fragment側に波の強さを伝える（色に反映させる）
  varying float vStrength;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // ── 波紋で頂点を上下させる（前回の応用）──────────────
    float dist = length(modelPosition.xz); // XZ平面の中心からの距離
    float wave = sin(dist * 3.0 - uTime * 2.0) * 0.3;
    wave *= smoothstep(6.0, 0.5, dist); // 端でフェードアウト
    modelPosition.y += wave;

    // varyingで波の強さをfragmentに渡す
    vStrength = wave / 0.3; // -1.0 〜 1.0 に正規化

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // ── gl_PointSize ─────────────────────────────────────
    // aSize: JS側でランダムに設定した個別サイズ（1.0〜4.0程度）
    // uPixelRatio: Retina対応（2.0なら2倍のピクセル密度）
    // / (-viewPosition.z): 遠くにある点は小さく見える（透視投影）
    gl_PointSize = aSize * uPixelRatio * (200.0 / -viewPosition.z);
  }
`;

// ─── Fragment Shader ───────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  uniform vec3 uColorA; // 波の谷の色
  uniform vec3 uColorB; // 波の山の色

  varying float vStrength;

  void main() {
    // ── gl_PointCoord で円形マスク ─────────────────────────
    // gl_PointCoord はスプライト内の0〜1のUV
    // 中心(0.5, 0.5)からの距離で円を作る
    vec2 uv = gl_PointCoord - 0.5; // 中心を原点に
    float dist = length(uv);

    // 0.5以上（正方形の角）は描画しない → 円形になる
    if (dist > 0.5) discard;

    // 円の端をなめらかにフェードアウト
    float alpha = smoothstep(0.5, 0.2, dist);

    // ── 波の強さで色を補間 ───────────────────────────────
    float colorMix = vStrength * 0.5 + 0.5; // 0.0〜1.0に変換
    vec3 color = mix(uColorA, uColorB, colorMix);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ─── Component ─────────────────────────────────────────────────────────────────
type Props = { count?: number };

export default function ParticleSystem({ count = 3000 }: Props) {
  const pointsRef = useRef<THREE.Points>(null);

  // ── BufferGeometry に渡す属性データを生成 ──────────────────
  // useMemoで一度だけ計算（毎フレーム再計算しない）
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3); // x,y,z × count
    const sizes = new Float32Array(count);          // size × count

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // XZ平面にランダムに配置（直径10の円形エリア）
      const r = Math.sqrt(Math.random()) * 5; // 均一な円形分布
      const theta = Math.random() * Math.PI * 2;
      positions[i3]     = Math.cos(theta) * r; // x
      positions[i3 + 1] = 0;                   // y（シェーダーで動かす）
      positions[i3 + 2] = Math.sin(theta) * r; // z

      // ランダムサイズ（大きい点は少なく）
      sizes[i] = Math.random() * 3 + 1; // 1.0〜4.0
    }

    return { positions, sizes };
  }, [count]);

  // ── uniform 定義 ────────────────────────────────────────────
  const uniforms = useMemo(
    () => ({
      uTime:       { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColorA:     { value: new THREE.Color("#1a0533") }, // 深紫（谷）
      uColorB:     { value: new THREE.Color("#c084fc") }, // 明紫（山）
    }),
    []
  );

  // ── 毎フレーム uTime を更新 ─────────────────────────────────
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    (pointsRef.current.material as THREE.ShaderMaterial)
      .uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points ref={pointsRef}>
      {/*
        bufferGeometry で頂点データを渡す
        bufferAttribute の attach="attributes-position" が重要
      */}
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}  // 3 = x,y,z の要素数
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}      // 1 = 要素数（スカラー）
        />
      </bufferGeometry>

      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}       // alphaを使うので必須
        depthWrite={false}        // 透明パーティクルの描画順問題を回避
        blending={THREE.AdditiveBlending} // 重なった部分が明るくなる（光っぽく）
      />
    </points>
  );
}
