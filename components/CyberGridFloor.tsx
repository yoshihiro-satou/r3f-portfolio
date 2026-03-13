'use client'

import { Grid } from '@react-three/drei'

export function CyberGridFloor() {
  return (
    <Grid
      args={[30, 30]}
      position={[0, -3.5, 0]}
      cellSize={1}
      cellThickness={1.2}
      cellColor="#00ffff"
      sectionSize={5}
      sectionThickness={2}
      sectionColor="#ff00aa"
      fadeDistance={40}
      fadeStrength={4}
    />
  )
}
