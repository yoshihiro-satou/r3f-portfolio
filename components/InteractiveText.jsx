import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

export const InteractiveText = ({ children }) => {
  const meshRef = useRef()

  // 1. マウスが乗っているかどうかを管理するステート
  const [hovered, setHovered] = useState(false)

  useFrame(({ pointer }) => {
    if(meshRef.current) {
      // 1. 目標となる回転（角度）をマウス位置から計算
      // pointer.x/y は -1 ~ 1 なので、0.5を掛けて最大30度くらいに調整
      const targetRotationX = -pointer.y * 0.5
      const targetRotaitonY = pointer.x * 0.5

      // 2. 「のけぞり」の追加
      // ホバー時は、Z軸（奥行き）を少しマイナスにする
      const targetZ = hovered ? -0.5 : 0

      // 2. lerp(線形補間)を使って、現在の角度から目標の角度へじわっと近づける
      // これを入れないと、動きがカクカクしてしまいます
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotationX,
        0.1 // 追従スピード(0.1 = 10%ずつ近づく)
      )
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotaitonY,
        0.1
      )

      // 3. 少しだけ位置も動かす(視覚効果: パララックス)
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        pointer.x * 0.5,
        0.05
      )
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1)

      // 3. 発行強度の変化（じわっと光る）
      // hovered が true なら強度を 2 に、false なら 0 に
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        hovered ? 2 : 0,
        0.1
      )
    }
  })

  return (
    <Text
      ref={meshRef}
      fontSize={1}
      color="white"
      // マウスイベントの登録
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {children}
      {/* 4. 発行するマテリアルの設定 */}
      <meshStandardMaterial
        attach="material"
        color="white"
        emissive="cyan" // 光る色
        emissiveIntensity={0}
        toneMapped={false} // これをfalseにすると、より強く光る
      />
    </Text>
  )
}
