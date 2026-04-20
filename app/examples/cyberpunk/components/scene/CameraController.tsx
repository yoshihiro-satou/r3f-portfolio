'use client';

import { useFrame } from '@react-three/fiber';
import { useScrollStore } from '../../store/useScrollStore';
import * as THREE from 'three';

export function CameraController() {
  useFrame((state) => {
    // スクロールの進行度(0.0 ~ 1.0)を取得
    const progress = useScrollStore.getState().progress;

    // カメラの目標位置(Target Position)を計算
    // 例： スクロールが進むにつれて、Z軸方向(奥)へ前進し、Y軸方向(下)へ潜り込む
    const targetZ = 8 - (progress * 15); // 初期位置8から、最大で-7まで前進
    const targetY = -(progress * 5) // 初期位置0から、下に5沈む

    // カメラの目標角度(Traget Rotation)を計算
    // 例：前進しながらカメラを少し上に向ける(見上げるような視点になる)
    const targetRotationX = progress * (Math.PI / 6); // 30度上を向く

    // lerpを使用して、現在のカメラ位置から目標位置へ滑らかに移動させる
    // 0.05という係数が「カメラの重さ・感性」を表現する
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);

    // 角度も滑らかに補間
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetRotationX, 0.05);
  });

  return null; // このコンポーネントはロジックのみで描画物をもたない
}
