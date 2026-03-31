"use client"

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Text, Float } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

// キューブ単体のコンポーネント
function PuzzleCube({ position, isCleared }: { position: [number, number, number], isCleared: boolean}) {
  const [rotation, setRotaion] = useState([0, 0, 0]);

  // クリックでランダムな方向に90度回転
  const handleClick = () => {
    if(isCleared) return;
    const directions = [
      [Math.PI / 2, 0, 0],
      [0, Math.PI / 2, 0],
      [0, 0, Math.PI / 2],
    ];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    setRotaion([
      rotation[0] + randomDir[0],
      rotation[1] + randomDir[2],
      rotation[2] + randomDir[2],
    ]);
  };

  // アニメーション設定
  const { springRotation } = useSpring({
    springRotation: isCleared ? [0, 0, 0] : rotation, // クリア時は強制的に正面を向く
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <a.mesh position={position} rotation={springRotation as any} onClick={handleClick}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      {/* 6面に異なる色を配置 */}
      <meshStandardMaterial attach="material-0" color="orange" />
      <meshStandardMaterial attach="material-1" color="white" />
      <meshStandardMaterial attach="material-2" color="blue" />
      <meshStandardMaterial attach="material-3" color="yellow" />
      <meshStandardMaterial attach="material-4" color="green" />
      <meshStandardMaterial attach="material-5" color="red" /> {/* 前面 */}
    </a.mesh>
  );
} 

