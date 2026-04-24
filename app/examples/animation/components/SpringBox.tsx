'use client'

import { useState } from 'react';
import { useSpring, animated } from '@react-spring/three';

export default function SpringBox() {
  const [active, setActive] = useState(false);

  const { scale } = useSpring({
    scale: active ? 1.5 : 1,
    config: { mass: 1, tension: 200, friction: 20},
  })

  return (
    <animated.mesh
      scale={scale}
      onClick={() => setActive(a => !a)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" />
    </animated.mesh>
  )
}
