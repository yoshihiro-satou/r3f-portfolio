"use client"

import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { Environment } from "@react-three/drei"
import Board from "./Board"
import Ball from "../Ball"
import Flipper from "./Flipper"

export default function GameScene() {
  return (
    // cameraで視点を設定。[x, y, z]なので、z軸から奥を見る
    <Canvas camera={{ position: [0, 0, 15], fov: 50}} >

      {/* 物理演算の世界を作る。gravityは[x, y, z]で重力の向きを決める。今回は下向き */}
      <Physics gravity={[0, -10, 0]}>

        {/* この中に物理演算を聞かせたいものを入れる */}
        <Board />
        <Ball position={[0, 6, 0]} />

        {/* 左(true)と右(false)のフリッパーを配置 */}
        <Flipper position={[-2.5, -5, 0]} isLeft={true} />
        <Flipper position={[2.5, -5, 0]} isLeft={false} />
      </Physics>

      {/* いい感じの照明を自動で当ててくれるお助けアイテム */}
      <Environment preset="city" />
    </Canvas>
  )
}
