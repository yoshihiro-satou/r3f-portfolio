// app/mouse-shader/shaders/vertex.glsl.ts
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vElevation;

  uniform float uTime;
  uniform vec2  uMouse;     // ← 今日の主役：マウス位置（-1〜1）
  uniform float uStrength;  // 波紋の強さ（lerp でスムーズに変化）

  void main() {
    vUv = uv;

    // UV座標系でのマウス位置（0〜1）に変換
    vec2 mouseUV = uMouse * 0.5 + 0.5;

    // 頂点のUVとマウスUVの距離
    float dist = distance(vUv, mouseUV);

    // 距離をもとに波紋を生成
    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.06;
    ripple *= smoothstep(0.5, 0.0, dist);   // 中心付近だけ強く
    ripple *= uStrength;                     // マウス移動量で増幅

    vElevation = ripple;

    vec3 pos = position;
    pos.z += ripple;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
