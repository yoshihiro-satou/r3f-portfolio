// components/scene/shaders/MatrixTunnel.tsx
'use client';

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { useScrollStore } from '../../../store/useScrollStore';

export function MatrixTunnel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00ffcc') },
  }), []);

  useFrame((state) => {
    // 1. シェーダーの動き
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    // 2. スクロールによる背景回転
    if (meshRef.current) {
      const progress = useScrollStore.getState().progress;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        progress * Math.PI * 2,
        0.05
      );
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[15, 15, 100, 32, 1, true]} />
      <shaderMaterial
        ref={materialRef}
        side={THREE.BackSide}
        transparent={true}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
          void main() {
            vec2 st = vUv * vec2(40.0, 10.0);
            vec2 ipos = floor(st);
            float speed = 1.0 + random(vec2(ipos.x, 0.0)) * 2.0;
            float y = fract(st.y + uTime * speed);
            float brightness = random(ipos + floor(uTime * 15.0));
            brightness = step(0.2, brightness);
            vec3 finalColor = uColor * y * brightness * 2.0;
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
      />
    </mesh>
  );
}
