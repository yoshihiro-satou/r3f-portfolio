// app/mouse-shader/shaders/fragment.glsl.ts
export const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying float vElevation;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec3  uColor;

  void main() {
    // マウス中心からの距離でグロー
    vec2 mouseUV = uMouse * 0.5 + 0.5;
    float dist = distance(vUv, mouseUV);

    // グリッド（前回のパターン継承）
    vec2 grid = fract(vUv * 12.0);
    float lineX = smoothstep(0.95, 1.0, grid.x) + smoothstep(0.05, 0.0, grid.x);
    float lineY = smoothstep(0.95, 1.0, grid.y) + smoothstep(0.05, 0.0, grid.y);
    float gridLine = clamp(lineX + lineY, 0.0, 1.0);

    // 波紋の色（elevation → 明るさ）
    float rippleColor = vElevation * 12.0 + 0.4;
    vec3 color = uColor * rippleColor;

    // グリッドをマウス距離でフェード
    float gridFade = smoothstep(0.5, 0.0, dist);
    color += vec3(0.1, 0.4, 1.0) * gridLine * gridFade * 0.8;

    // マウス中心のグロースポット
    float glow = smoothstep(0.3, 0.0, dist);
    color += uColor * glow * 0.5;

    // 全体ビネット
    float vignette = smoothstep(0.8, 0.2, length(vUv - 0.5) * 1.8);
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;
