import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function RotatingModel({ url }: {url: string }) {
  const { scene } = useGLTF(url)
  // ref でメッシュを直接参照する(Reactのstateを使わない = 再レンダリングしない)
  const ref = useRef<THREE.Group>(null)

  // 毎フレーム呼ばれる。delta = 前フレームからの経過秒数
  useFrame((state, delta) => {
    if(!ref.current) return
    ref.current.rotation.y += delta * 0.5 // 1秒で0.5ラジアン回転
  })
  return <primitive ref={ref} object={scene}/>
}
