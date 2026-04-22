export const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying float vParticleId;

  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2 uMouse;

  // Gentle undulation for the plane geometry
  float mistWave(vec2 p, float t) {
    return sin(p.x * 2.1 + t * 0.25) * cos(p.y * 1.8 + t * 0.18) * 0.06
         + sin(p.x * 4.3 - t * 0.15) * 0.03;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float scroll = uScrollProgress;
    float mist = mistWave(pos.xy, uTime) * (1.0 + scroll * 0.5);

    // Mouse-driven gentle lift
    float mouseDist = length(uv - uMouse);
    float mouseWarp = exp(-mouseDist * 3.5) * sin(mouseDist * 12.0 - uTime * 1.5) * 0.04;

    pos.z += mist + mouseWarp;
    vElevation = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;

  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uSection;
  uniform vec2  uMouse;

  // ── Palette ──────────────────────────────────────────────
  const vec3 inkBlack   = vec3(0.04, 0.03, 0.05);
  const vec3 deepNight  = vec3(0.07, 0.05, 0.12);
  const vec3 gold       = vec3(0.82, 0.68, 0.28);
  const vec3 sakura     = vec3(0.88, 0.62, 0.70);
  const vec3 sakuraDeep = vec3(0.70, 0.35, 0.48);
  const vec3 mistWhite  = vec3(0.88, 0.84, 0.90);
  const float PI        = 3.14159265359;

  // ── Hash / noise utils ───────────────────────────────────
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash2(i);
    float b = hash2(i + vec2(1.0, 0.0));
    float c = hash2(i + vec2(0.0, 1.0));
    float d = hash2(i + vec2(1.0, 1.0));
    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 6; i++) { v += smoothNoise(p) * a; p *= 2.1; a *= 0.5; }
    return v;
  }

  // ── Mist / fog layer ─────────────────────────────────────
  float mistLayer(vec2 uv, float t, float speed, float scale) {
    vec2 p = uv * scale + vec2(t * speed, t * speed * 0.4);
    return fbm(p) * fbm(p * 0.7 + vec2(1.3, 2.1));
  }

  // ── Sakura petal (5-lobe SDF) ────────────────────────────
  float petalSDF(vec2 p) {
    float angle = atan(p.y, p.x);
    float r = length(p);
    // Five lobes
    float lobes = 0.4 + 0.3 * cos(5.0 * angle);
    return r - lobes * 0.5;
  }

  // ── Single floating petal ────────────────────────────────
  float sakuraPetal(vec2 uv, float id, float t) {
    float r1 = hash(id);
    float r2 = hash(id + 0.13);
    float r3 = hash(id + 0.27);
    float r4 = hash(id + 0.41);
    float r5 = hash(id + 0.55);

    // Fall speed & phase
    float speed  = 0.04 + r2 * 0.06;
    float phase  = r3;
    float life   = fract(t * speed + phase);          // 0→1 lifecycle

    // Position: drift across screen, wrap top→bottom
    float xBase  = r1;
    float xDrift = sin(t * (0.3 + r4 * 0.4) + r2 * 6.28) * 0.12;
    float x      = fract(xBase + xDrift);
    float y      = 1.0 - life;                        // falls downward

    // Spin
    float spinSpeed = (r5 - 0.5) * 3.0;
    float rot       = t * spinSpeed + r4 * 6.28;
    float cr = cos(rot); float sr = sin(rot);

    // Size (small, varied)
    float sz = (0.008 + r2 * 0.014);

    // Local coords
    vec2 toUv = uv - vec2(x, y);
    vec2 lp   = vec2(cr * toUv.x + sr * toUv.y,
                    -sr * toUv.x + cr * toUv.y) / sz;

    // Fade at top & bottom of lifecycle
    float fade = smoothstep(0.0, 0.1, life) * smoothstep(1.0, 0.85, life);
    // Fade based on distance from horizontal center
    float xFade = smoothstep(0.0, 0.05, x) * smoothstep(1.0, 0.95, x);

    float sdf = petalSDF(lp);
    float petal = smoothstep(0.08, -0.1, sdf);
    return petal * fade * xFade;
  }

  // ── Gold dust particles ───────────────────────────────────
  float goldDust(vec2 uv, float t) {
    float total = 0.0;
    // 3 layers of grid-based sparkle
    for (int layer = 0; layer < 3; layer++) {
      float scale = 18.0 + float(layer) * 9.0;
      vec2 gUv    = fract(uv * scale + vec2(float(layer) * 3.7, float(layer) * 1.3)
                          + t * vec2(0.01, 0.02 + float(layer) * 0.005)) - 0.5;
      float cellId = floor(uv.x * scale) * 100.0 + floor(uv.y * scale)
                   + float(layer) * 1000.0;
      float r      = hash(cellId);
      float pulse  = sin(t * (1.0 + r * 2.0) + r * 6.28) * 0.5 + 0.5;
      float spark  = smoothstep(0.06, 0.0, length(gUv)) * pulse * step(0.78, r);
      total       += spark * (0.4 + float(layer) * 0.2);
    }
    return total;
  }

  void main() {
    vec2 uv      = vUv;
    float t      = uTime;
    float scroll = uScrollProgress;
    float sec    = uSection;   // 0→3

    // ── Background: deep ink with section color shift ─────
    float wash1  = mistLayer(uv, t, 0.018, 2.2);
    float wash2  = mistLayer(uv, t * 0.7, 0.012, 1.4);
    float wash   = wash1 * 0.6 + wash2 * 0.4;

    // Section palette interpolation
    // 0=deep night, 1=slightly warmer, 2=sakura tint, 3=back to ink
    vec3 bgA = mix(inkBlack, deepNight, smoothstep(0.0, 1.0, sec));
    vec3 bgB = mix(bgA, mix(inkBlack, sakuraDeep * 0.25, 0.6), smoothstep(1.0, 2.0, sec));
    vec3 bgC = mix(bgB, inkBlack, smoothstep(2.0, 3.0, sec));
    vec3 baseColor = mix(bgC, bgC + mistWhite * 0.04, wash * 0.5);

    // ── Mist glow layers ─────────────────────────────────
    float mist1 = mistLayer(uv, t * 0.6, 0.008, 1.1);
    float mist2 = mistLayer(uv + 0.3, t * 0.9, 0.014, 1.8);
    float mistGlow = mist1 * 0.5 + mist2 * 0.3;

    // Sakura-pink mist that grows with section
    float sakuraPhase = smoothstep(0.5, 2.5, sec);
    vec3 mistColor = mix(mistWhite * 0.06, sakura * 0.18, sakuraPhase);
    baseColor += mistColor * mistGlow;

    // ── Sakura petals ─────────────────────────────────────
    float petalMask = 0.0;
    // 32 petals for richness
    for (int i = 0; i < 32; i++) {
      petalMask += sakuraPetal(uv, float(i) * 0.317 + 0.05, t);
    }
    petalMask = min(petalMask, 1.0);

    // Petal color: base sakura + gold shimmer on elevation
    float shimmer = smoothstep(0.3, 0.8, hash2(uv * 80.0 + t * 0.3));
    vec3 petalColor = mix(sakura, gold * 0.9, shimmer * 0.35);
    // More gold shimmer near top of scroll
    petalColor = mix(petalColor, gold, scroll * 0.3);

    // ── Gold dust sparkles ────────────────────────────────
    float dust     = goldDust(uv, t);
    vec3 dustColor = mix(gold, mistWhite, 0.4) * dust;

    // ── Mouse-reactive bloom ──────────────────────────────
    float mouseDist  = length(uv - uMouse);
    float mouseBloom = exp(-mouseDist * 5.0) * 0.12;
    vec3 bloomColor  = mix(sakura, gold, 0.5) * mouseBloom;

    // ── Elevation highlight ───────────────────────────────
    float elevGlow = smoothstep(0.0, 0.1, vElevation) * 0.1;
    vec3 elevColor = mix(mistWhite, gold, 0.3) * elevGlow;

    // ── Vignette ─────────────────────────────────────────
    float vignette = 1.0 - smoothstep(0.25, 0.95, length((uv - 0.5) * vec2(1.0, 1.3)));

    // ── Grain ─────────────────────────────────────────────
    float grain = hash2(uv * 600.0 + fract(t)) * 0.018;

    // ── Compose ───────────────────────────────────────────
    vec3 color = baseColor;
    color += petalColor * petalMask * 0.85;
    color += dustColor;
    color += bloomColor;
    color += elevColor;
    color *= vignette;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;
