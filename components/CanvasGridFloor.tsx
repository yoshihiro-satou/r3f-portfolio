'use client'

import { Canvas } from '@react-three/fiber'
import { Grid } from '@react-three/drei'

export function CanvasGridFloor() {
  return (
    <Canvas camera={{position: [-10, 2, 10], fov: 50}}>
      <Grid
        args={[30, 30]}
        position={[0, -3.5, 0]}
        cellSize={1}
        cellThickness={1.2}
        cellColor="#00ffff"
        sectionSize={5}
        sectionThickness={2}
        sectionColor="#00ff00"
        fadeDistance={40}
        fadeStrength={4}
      />
    </Canvas>
  )
}
