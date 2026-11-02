"use client";

/**
 * Animated dusk light for the AccelRevenue band: a slow, domain-warped gradient in the exact
 * navy → ember palette of the film's final act. One full-screen shader, no geometry or objects.
 * Rendered only while on-screen; the CSS `.dusk-band` gradient underneath is the fallback.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.04;
    vec2 q = vec2(fbm(uv * 2.2 + t), fbm(uv * 2.2 - t + 3.1));
    float n = fbm(uv * 1.6 + q * 1.4 + vec2(0.0, t * 2.0));

    // horizon glow rises from the bottom, bending with the noise and the pointer
    float horizon = smoothstep(0.95, -0.1, uv.y + (n - 0.5) * 0.35 - (uPointer.x - 0.5) * 0.08 * (1.0 - uv.y));
    vec3 ink   = vec3(0.039, 0.071, 0.133);  // #0a1222
    vec3 navy  = vec3(0.078, 0.149, 0.290);  // #14264a
    vec3 plum  = vec3(0.47, 0.24, 0.23);
    vec3 ember = vec3(0.851, 0.439, 0.235);  // #d9703c
    vec3 col = mix(ink, navy, smoothstep(0.0, 0.6, horizon + n * 0.2));
    col = mix(col, plum, smoothstep(0.45, 0.8, horizon));
    col = mix(col, ember, smoothstep(0.72, 1.0, horizon) * 0.85);

    // soft light pool following the pointer
    vec2 d = uv - uPointer;
    col += vec3(0.95, 0.55, 0.3) * exp(-dot(d, d) * 9.0) * 0.07;

    // grain
    col += (hash(uv * 900.0 + floor(uTime * 24.0)) - 0.5) * 0.025;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Field({ pointer }: { pointer: React.MutableRefObject<[number, number]> }) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(0.5, 0.3) } }), []);
  useFrame((_, dt) => {
    uniforms.uTime.value += Math.min(dt, 0.1);
    const p = uniforms.uPointer.value;
    p.x += (pointer.current[0] - p.x) * 0.04;
    p.y += (pointer.current[1] - p.y) * 0.04;
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

export default function DuskField() {
  const host = useRef<HTMLDivElement>(null);
  const pointer = useRef<[number, number]>([0.5, 0.3]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = host.current!;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div ref={host} aria-hidden className="pointer-events-none absolute inset-0">
      <Canvas dpr={[1, 1.25]} flat linear frameloop={visible ? "always" : "never"} gl={{ antialias: false, depth: false, stencil: false, powerPreference: "low-power" }} style={{ position: "absolute", inset: 0 }}>
        <Field pointer={pointer} />
      </Canvas>
    </div>
  );
}
