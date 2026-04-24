'use client'

import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Group } from 'three';

export default function AnimatedModel() {
  const groupRef = useRef<Group>(null);

  // GLTFファイルを読み込む
  const { scene, animations } = useGLTF('/models/Orion.glb')

  // アニメーションをグループ紐づける
  const { actions, names } = useAnimations(animations, groupRef)

  useEffect(() => {
    if(!actions || names.length === 0) return
    // 最初のアニメーションを再生
    actions[names[0]]?.reset().fadeIn(0.5).play()

    return () => {
      actions[names[0]]?.fadeOut(0.5)
    }
  }, [actions, names])
  return <primitive ref={groupRef} object={scene} scale={1} />
}
