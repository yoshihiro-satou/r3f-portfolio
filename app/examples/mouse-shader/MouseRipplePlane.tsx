// app/mouse-shader/MouseRipplePlane.tsx
"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader } from "./shaders/vertex.glsl";
import { fragmentShader } from "./shaders/fragment.glsl";

export default function MouseRipplePlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  // raycaster と camera は useThree から取得
  const { camera, gl } = useThree();

  // マウス位置（NDC: -1〜1）を保持
  const mouse = useRef(new THREE.Vector2(0, 0));
  const prevMouse = useRef(new THREE.Vector2(0, 0));

  // Raycaster インスタンス（毎フレーム再生成しない）
  const raycaster = useRef(new THREE.Raycaster());

  // マウス移動量（lerp のターゲット）
  const targetStrength = useRef(0);

  // uniforms（useRef で安定保持）
  const uniforms = useRef({
    uTime:     { value: 0 },
    uMouse:    { value: new THREE.Vector2(0, 0) },
    uStrength: { value: 0 },
    uColor:    { value: new THREE.Color("#4488ff") },
  });

  // mousemove イベントは Canvas の pointer イベントではなく
  // window で拾う（Canvas外まで対応するため）
  // ※ useEffect でも可だが、ここでは R3F の onPointerMove を使う方法を採用

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    // 1. uTime 更新
    mat.uniforms.uTime.value += delta;

    // 2. Raycaster でマウス → 3D平面の交点を取得
    raycaster.current.setFromCamera(state.pointer, camera);
    const hits = raycaster.current.intersectObject(meshRef.current);

    if (hits.length > 0) {
      const uv = hits[0].uv!;
      // UV（0〜1）→ NDC（-1〜1）に変換して uMouse へ
      const targetMouse = new THREE.Vector2(
        uv.x * 2 - 1,
        uv.y * 2 - 1
      );
      // スムーズ追従（lerp）
      mat.uniforms.uMouse.value.lerp(targetMouse, 0.08);

      // 3. マウス移動量で波紋の強さを制御
      const moveSpeed = prevMouse.current.distanceTo(targetMouse);
      targetStrength.current = Math.min(moveSpeed * 30, 1.0);
      prevMouse.current.copy(targetMouse);
    } else {
      // プレーン外に出たら徐々に 0 に
      targetStrength.current *= 0.95;
    }

    // strength を lerp でスムーズに
    mat.uniforms.uStrength.value +=
      (targetStrength.current - mat.uniforms.uStrength.value) * 0.1;
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]} // 水平に
    >
      {/* 前回より細かい subdivisions で波紋を滑らかに */}
      <planeGeometry args={[6, 6, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
