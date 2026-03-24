"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime; // JavaScriptから「経過時間」を受け取るぞ
  varying vec2 vUv;    // フラグメントシェーダーに座標を渡すための変数

  void main() {
    vUv = uv; // モデルのUV座標を渡しておく
    
    // 時間（uTime）を使って、頂点のZ座標をサイン波で揺らす！
    vec3 newPosition = position;
    newPosition.z += sin(position.x * 5.0 + uTime) * 0.2;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    // 時間を使って色を滑らかに変える（0.5〜1.0の間で揺れる赤系）
    float strength = sin(uTime) * 0.5 + 0.5;
    vec3 color = vec3(strength, vUv.x, vUv.y);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function AnimatedShaderBox() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // 1. 初期のUniformsを設定（useMemoで再生成を防ぐ）
  const uniforms = useMemo(() => ({
    uTime: { value: 0.0 },
  }), []);

  // 2. 毎フレーム実行されるループ処理（ここが心臓部だ！）
  useFrame((state) => {
    if (materialRef.current) {
      // ページが開いてからの経過時間（秒）をシェーダーに叩き込む
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
      {/* 頂点を細かく動かしたいので、分割数を多めにするのがコツだ！ */}
      <boxGeometry args={[2, 2, 2, 32, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function TimeShaderApp() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <AnimatedShaderBox />
      </Canvas>
    </div>
  );
}
