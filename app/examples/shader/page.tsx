"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState, Suspense } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei'; // ★追加：テクスチャ読み込み用の魔法のフック

const vertexShader = `
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uMouse;
  
  varying vec2 vUv;
  varying float vDampening; // ★追加：フラグメントシェーダーに減衰率を渡す

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // 前回の波紋の計算だ
    float dist = distance(uv, uMouse);
    float ripple = sin(dist * 30.0 - uTime * 5.0);
    float dampening = smoothstep(0.5, 0.0, dist);
    
    // フラグメントシェーダーに渡すためにvaryingに入れる
    vDampening = dampening;
    
    // 頂点をZ軸方向に動かす
    pos.z += ripple * dampening * uHover * 0.15;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uHover;
  uniform sampler2D uTexture; // ★追加：JavaScriptから渡される画像データ
  
  varying vec2 vUv;
  varying float vDampening; // ★追加：頂点シェーダーから受け取った減衰率

  void main() {
    // 1. UV座標を少し歪ませる（これが画像の歪みになる！）
    // vUv（元の画像の座標）に、頂点シェーダーで計算した波の動き（vDampening）を少し足し算する
    // uHover を掛けることで、ホバー時だけ歪むようにするぞ
    vec2 distortedUv = vUv + vDampening * uHover * 0.05;
    
    // 2. 歪ませたUV座標を使って、画像の色を取得する
    // texture2D(画像, 座標) という関数を使うんだ
    vec4 textureColor = texture2D(uTexture, distortedUv);
    
    // 3. 最終的な色を出力する
    gl_FragColor = textureColor;
  }
`;

function DistortedImage() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHover] = useState(false);

  // ★追加：useTextureフックで画像を読み込む
  // public/sample.jpg をルート(/)として指定するぞ
  const texture = useTexture('/aerial-view-tokyo-cityscape-with-fuji-mountain-japan.jpg');

  const uniforms = useMemo(() => ({
    uTime: { value: 0.0 },
    uHover: { value: 0.0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTexture: { value: texture }, // ★追加：読み込んだテクスチャを渡す
  }), [texture]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const targetHover = hovered ? 1.0 : 0.0;
      materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uHover.value,
        targetHover,
        0.1
      );
    }
  });

  return (
    <mesh 
      // 画像なので正面に向ける
      rotation={[0, 0, 0]} 
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onPointerMove={(e) => {
        if (e.uv && materialRef.current) {
          materialRef.current.uniforms.uMouse.value.copy(e.uv);
        }
      }}
    >
      {/* 画像の比率に合わせてargsを調整するのを忘れずに！（例：16:9なら args={[4, 2.25, 128, 128]}） */}
      <planeGeometry args={[4, 3, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ImageApp() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* ★追加：画像の読み込みが完了するまで待機するReactのSuspense */}
        <Suspense fallback={null}>
          <DistortedImage />
        </Suspense>
      </Canvas>
    </div>
  );
}
