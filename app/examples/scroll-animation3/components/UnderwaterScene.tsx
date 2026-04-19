"use client"

import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import WaterBackground from './WaterBackground';

export default function UnderwaterScene() {
  return (
    <div style={{ width: '100vw', height: '100vh '}}>
      <Canvas camera={{ position: [0, 0, 1]}}>
        {/* pages={4} で4画面分のスクロールを定義 */}
        <ScrollControls pages={4} damping={0.2}>

          {/* 3D背景 */}
          <WaterBackground />
          {/* HTMLオーバーレイ(スクロールに連動して動くDOM) */}
          <Scroll html style={{ width: '100%' }}>
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'ccenter', color: 'white', fontSize: '3rem'}}>
              <h1>水面(page1)</h1>
            </div>
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'ccenter', color: 'white', fontSize: '3rem'}}>
              <h2>浅瀬(page2)</h2>
            </div>
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'ccenter', color: 'white', fontSize: '3rem'}}>
              <h2>中層(page3)</h2>
            </div>
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'ccenter', color: 'white', fontSize: '3rem'}}>
              <h2>深層(page4)</h2>
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  )
}
