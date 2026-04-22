'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders/waveShader';

// ─── Inner mesh (needs R3F context) ────────────────────────────────────────────
function WaveMesh({ scrollProgress, currentSection, mouseRef }) {
  const meshRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime:           { value: 0 },
      uScrollProgress: { value: 0 },
      uSection:        { value: 0 },
      uMouse:          { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material;
    mat.uniforms.uTime.value           = clock.getElapsedTime();
    mat.uniforms.uScrollProgress.value = THREE.MathUtils.lerp(
      mat.uniforms.uScrollProgress.value, scrollProgress, 0.04
    );
    mat.uniforms.uSection.value = THREE.MathUtils.lerp(
      mat.uniforms.uSection.value, currentSection, 0.03
    );
    // Read from ref — no re-render needed
    if (mouseRef?.current) {
      mat.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.06
      );
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.8, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[6, 6, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Camera controller ─────────────────────────────────────────────────────────
function ScrollCamera({ scrollProgress, currentSection }) {
  const { camera } = useThree();

  // Camera keyframes per section
  const keyframes = useMemo(
    () => [
      { pos: [0, 2.5, 4.0], target: [0, 0, 0] },     // Hero   - frontal
      { pos: [-1.5, 1.5, 3.0], target: [0.5, 0, 0] }, // About  - slight left tilt
      { pos: [1.2, 3.5, 2.5], target: [0, 0, 0] },    // Works  - bird's eye
      { pos: [0, 1.0, 5.0], target: [0, 0.5, 0] },    // Contact- low angle
    ],
    []
  );

  useFrame(() => {
    const total = scrollProgress * 3; // 0–3 range across 4 sections
    const idx = Math.min(Math.floor(total), 2);
    const t = total - idx;

    const a = keyframes[idx];
    const b = keyframes[idx + 1];

    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    camera.position.set(
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], eased),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], eased),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], eased)
    );
    camera.lookAt(
      THREE.MathUtils.lerp(a.target[0], b.target[0], eased),
      THREE.MathUtils.lerp(a.target[1], b.target[1], eased),
      THREE.MathUtils.lerp(a.target[2], b.target[2], eased)
    );
  });

  return null;
}

// ─── Exported component ────────────────────────────────────────────────────────
export default function ShaderBackground({ scrollProgress, currentSection, mouseRef }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 100, position: [0, 2.5, 4.0] }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
      >
        <ScrollCamera scrollProgress={scrollProgress} currentSection={currentSection} />
        <WaveMesh
          scrollProgress={scrollProgress}
          currentSection={currentSection}
          mouseRef={mouseRef}
        />
      </Canvas>
    </div>
  );
}
