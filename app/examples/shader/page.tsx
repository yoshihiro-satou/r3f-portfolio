"use client";

import { Canvas, useThree } from '@react-three/fiber';
import { useRef, useMemo, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useControls, Leva } from 'leva'; // ★追加：UIコントローラー

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture; // 元の画像
  uniform sampler2D uNoise;   // ノイズ画像
  uniform float uDissolve;    // ディゾルブの進行度（0.0 〜 1.0）
  
  varying vec2 vUv;

  void main() {
    // 1. 元の画像の色を取得
    vec4 texColor = texture2D(uTexture, vUv);
    
    // 2. ノイズ画像から「値」を取得（黒白なのでrチャンネル）
    float noiseValue = texture2D(uNoise, vUv).r;
    
    // 3. ★核心：2つの境界線（ステップ）を作る
    
    // 境界線 A（完全に消滅する線）：smoothstep(進行度, 進行度+0.1, ノイズ値)
    // 進行度(uDissolve)より小さければ消える
    float dissolveAlpha = smoothstep(uDissolve, uDissolve + 0.1, noiseValue);
    
    // 境界線 B（炎の色がつく線）：smoothstep(進行度-0.1, 進行度, ノイズ値)
    // 消滅する線の少し手前（進行度-0.1）から炎の色にする
    float edgeFactor = smoothstep(uDissolve - 0.1, uDissolve, noiseValue);
    
    // 4. ★炎の色（vec3）を作る
    vec3 fireColor = vec3(0.0, 0.5, 1.0); // 鮮やかなオレンジ色だ！
    
    // 5. ★2枚の画像を「合成」する
    
    // mix()関数の魔法！
    // edgeFactor(炎の線)の値(0.0 〜 1.0) に応じて、元の色と炎の色をブレンドする
    // uDissolve-0.1 より手前なら元の色、uDissolve に近づくにつれ炎の色になる
    vec3 finalColor = mix(fireColor, texColor.rgb, edgeFactor);
    
    // 6. 最終的な色を出力（消滅のアルファ値を反映させる）
    gl_FragColor = vec4(finalColor, dissolveAlpha);
  }
`;

function FireEdgeDissolveImage() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const responsiveScale = Math.min(viewport.width / 4, 1);
  // useTextureフックで2枚の画像を読み込む
  const [texture, noise] = useTexture([
    '/fuji-mountain-japan.jpg', // 元画像
    '/noise-texture.png',   // ノイズ画像
  ]);

  // ★追加：Levaを使ってUIパネルを作成する
  // 'FireEdgeFactor' というツマミを作り、0.0〜1.0の間で操作できるようにする
  const { fireEdgeFactor } = useControls({
    fireEdgeFactor: { value: 0.0, min: 0.0, max: 1.0, step: 0.01 },
  });

  // Uniformsの準備
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uNoise: { value: noise },     // ノイズテクスチャ
    uDissolve: { value: 0.0 },   // 進行度の初期値
  }), [texture, noise]);

  // Levaの値をUniformsに反映させる（useEffectを使って Reactのタイミングに合わせるぞ！）
  useEffect(() => {
    // materialRef.current がちゃんと存在しているか確認してから代入する
    if (materialRef.current) {
      materialRef.current.uniforms.uDissolve.value = fireEdgeFactor;
    }
  }, [fireEdgeFactor]); 

  return (
    <mesh scale={responsiveScale}>
      <planeGeometry args={[4, 3, 128, 128]} />
      {/* ★重要：透明度（alpha）を有効にするために transparent={true} が必須だ！ */}
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true} 
      />
    </mesh>
  );
}

export default function FireEdgeDissolveApp() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>

      <Leva 
        oneLineLabels={true} // ラベルを一行にしてスッキリさせる
        titleBar={{ title: '🔥 Burn Control', drag: true }} // ドラッグ可能にする
      />
      
      {/* もし「もっと下にズラしたい」場合は、CSSのグローバル設定で 
        .leva-c-kkYvS { top: 100px !important; } のように書く必要があるが、
        まずは「ドラッグできる設定」にして手動で動かせるようにするのが一番楽だ！
      */}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* 画像の読み込みが完了するまで待機するReactのSuspense */}
        <Suspense fallback={null}>
          <FireEdgeDissolveImage />
        </Suspense>
      </Canvas>
    </div>
  );
}
