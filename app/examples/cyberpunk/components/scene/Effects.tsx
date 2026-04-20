'use client';

import { EffectComposer, Bloom, Glitch } from "@react-three/postprocessing";
import { GlitchMode } from 'postprocessing';
import { useScrollStore } from "../../store/useScrollStore";
import { useFrame }from '@react-three/fiber';
import { Vector2 } from "three";
import { useRef } from 'react';

export function Effects() {
  const glitchRef = useRef<any>(null);

  // オプション：スクロールが特定の区間に達したときにGlitchを激しくするなどの制御も可能
  // useFrame(() => {
  // const progress = usesScrollStore.getState().progress;
  // });

  return (
    <EffectComposer multisampling={0} >

      <Bloom
        luminanceThreshold={0.5}
        mipmapBlur
        intensity={1.5}
      />

      <Glitch
        ref={glitchRef}
        delay={new Vector2(1.5, 3.5)}
        duration={new Vector2(0.1, 0.3)}
        strength={new Vector2(0.02, 0.05)}
        mode={GlitchMode.SPORADIC}
        active={true}
      />
    </EffectComposer>
  )
}
