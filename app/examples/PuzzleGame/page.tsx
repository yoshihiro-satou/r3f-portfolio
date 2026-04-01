"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, Float } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import * as THREE from "three";

// --- キューブ単体のコンポーネント ---
function PuzzleCube({ 
  position, 
  rotationIdx, 
  onClick 
}: { 
  position: [number, number, number], 
  rotationIdx: [number, number, number],
  onClick: () => void 
}) {
  const { springRotation } = useSpring({
    springRotation: [
      rotationIdx[0] * (Math.PI / 2),
      rotationIdx[1] * (Math.PI / 2),
      rotationIdx[2] * (Math.PI / 2),
    ],
    config: { mass: 1, tension: 200, friction: 30 },
  });

  return (
    <a.mesh position={position} rotation={springRotation as any} onClick={onClick}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      {/* Three.jsのBox材料順序: 0:+x, 1:-x, 2:+y, 3:-y, 4:+z(前), 5:-z(後) */}
      <meshStandardMaterial attach="material-0" color="orange" />
      <meshStandardMaterial attach="material-1" color="white" />
      <meshStandardMaterial attach="material-2" color="blue" />
      <meshStandardMaterial attach="material-3" color="yellow" />
      <meshStandardMaterial attach="material-4" color="red" />    {/* 正面を赤に修正 */}
      <meshStandardMaterial attach="material-5" color="green" />
    </a.mesh>
  );
}

export default function PuzzleGame() {
  const [cubes, setCubes] = useState(Array(9).fill([0, 0, 0]));

  // --- クリア判定ロジック ---
  const isCleared = useMemo(() => {
    return cubes.every((rot) => {
      // 1. 各キューブの現在の回転をクォータニオン（回転情報）に変換
      const euler = new THREE.Euler(
        rot[0] * (Math.PI / 2),
        rot[1] * (Math.PI / 2),
        rot[2] * (Math.PI / 2)
      );
      
      // 2. 「初期状態で正面を向いているベクトル (0, 0, 1)」を用意
      const forward = new THREE.Vector3(0, 0, 1);
      
      // 3. ベクトルに回転を適用する
      forward.applyEuler(euler);
      
      // 4. 回転後のベクトルが、まだちゃんと正面(z=1)を向いているかチェック
      // 小数点誤差を考慮して 0.9 以上の判定にする
      return forward.z > 0.9;
    });
  }, [cubes]);

  const handleCubeClick = (index: number) => {
    if (isCleared) return;
    const newCubes = [...cubes];
    const newRot = [...newCubes[index]];
    
    // X軸かY軸のどちらかをランダムに回転（Z軸回転は面が変わらないのでパズルとしては不要）
    const axis = Math.random() > 0.5 ? 0 : 1;
    newRot[axis] += 1;
    
    newCubes[index] = newRot;
    setCubes(newCubes);
  };

  const shuffle = () => {
    const shuffled = cubes.map(() => [
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
      0,
    ]);
    setCubes(shuffled);
  };

  useEffect(() => { shuffle(); }, []);

  return (
    <main className="h-screen w-full bg-slate-950">
      <div className="absolute top-10 w-full z-10 text-center pointer-events-none select-none">
        <h1 className="text-white text-4xl font-black tracking-widest drop-shadow-lg">
          CUBE ALIGN
        </h1>
        <p className="text-slate-400 mt-2">赤い面をすべて手前に揃えろ</p>
        
        {isCleared && (
          <div className="mt-8">
            <h2 className="text-yellow-400 text-5xl font-bold animate-tada">COMPLETE!</h2>
            <button 
              onClick={shuffle}
              className="mt-6 pointer-events-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-full shadow-xl transition-all active:scale-95"
            >
              NEXT LEVEL
            </button>
          </div>
        )}
      </div>

      <Canvas camera={{ position: [0, 0, 7], fov: 40 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} />
        
        <Float speed={isCleared ? 5 : 0} rotationIntensity={isCleared ? 2 : 0} floatIntensity={isCleared ? 2 : 0}>
          <Center>
            {cubes.map((rot, i) => (
              <PuzzleCube 
                key={i}
                position={[(i % 3) - 1, Math.floor(i / 3) - 1, 0].map(v => v * 1.05) as any}
                rotationIdx={rot}
                onClick={() => handleCubeClick(i)}
              />
            ))}
          </Center>
        </Float>

        <OrbitControls enablePan={false} />
      </Canvas>
    </main>
  );
}
