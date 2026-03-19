'use client'

import { usePlane } from "@react-three/cannon"

export default function Walls() {
  // 床
  const[, api] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -10, 0]}))

  // 左右壁
  usePlane(() => ({ rotation: [0, Math.PI / 2, 0], position: [-12, 0, 0]}))
  usePlane(() => ({ rotation: [0, -Math.PI / 2, 0], position: [12, 0, 0]}))

  // 後ろ壁
  usePlane(() => ({ rotation: [0, 0, 0], position: [0, 0, -15]}))

  return null // 物理のみで可視化しない（必要なら<mesh>で可視化）
}
