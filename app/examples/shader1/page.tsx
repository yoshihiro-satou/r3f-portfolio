"use client"

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // 虹色を作るための魔法の関数（パレット）
  vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263, 0.416, 0.557);
  return a + b + cos(6.28318 * (c * t + d));
  }

  void main() {
    //1. レスポンシブ対応：座標を画面全体(0.0)基準、-1.0～1.0の範囲に正規化
    vec2 uv = (vUv * 2.0 - 1.0);
    uv.x *= uResolution.x / uResolution.y; // アスペクト比補正

    vec2 uv0 = uv; // 元の座標を保存しておく
    vec3 finalColor = vec3(0.0);

    // 2. ループを回転して「重なり」と「複雑さ」を出す(4回重ねる)
    for(float i = 0.0; i < 4.0; i++) {
    // 万華鏡効果：frachで繰り返し、absで反転させる
    uv = fract(uv * 1.5) - 0.5;

    // 距離を計算して、時間で動かす
    float d = length(uv) * exp(-length(uv0));

    vec3 col = palette(length(uv0) + i * 0.4 + uTime * 0.4);

    d = sin(d * 8.0 + uTime) / 8.0;
    d = abs(d);

    // 光り輝くエッジを作る(0.01を小さくスロとより鋭い光になる)
    d = pow(0.01 / d, 1.2);

    finalColor += col * d;
    }
  gl_FragColor = vec4(finalColor, 1.0);
}
`;
function PsychedelicBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree(); // レスポンシブ：現在の画面サイズを取得

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
  }), [size.width, size.height]);

  useFrame((state) => {
    if(materialRef.current) {
      // 毎フレーム時間を進める
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      // ★レスポンシブ：画面サイズが変わっても追従させる
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height)
    }
  });

  return (
    <mesh>
      {/* 画面いっぱいの板(plane)を作る。２は全画面カバーのサイズ */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
      />
    </mesh>
  )
}

export default function FullScenePage() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000',
      overflow: 'hidden'
      }}
    >
      <Canvas>
        <Suspense fallback={null}>
          <PsychedelicBackground />
        </Suspense>
      </Canvas>

    </div>
  )
}
