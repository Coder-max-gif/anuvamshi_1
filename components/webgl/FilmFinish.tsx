"use client";

/**
 * Optional WebGL "film finish" over the canvas sequence.
 * A single full-screen shader rendered as a neutral-grey grading layer and composited with
 * `mix-blend-mode: soft-light` (0.5 grey = no change). It adds:
 *   - 24 fps stepped film grain,
 *   - a soft optical vignette,
 *   - a faint warm key light that follows the pointer and strengthens during the dusk act,
 *     echoing the ember horizon already present in the footage.
 * No geometry, no objects, no fake depth. The canvas experience is complete without it.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

export type FilmState = { progress: number; pointer: [number, number]; active: boolean };

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform vec2 uRes;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 c = (vUv - 0.5) * vec2(aspect, 1.0);
    float vig = smoothstep(1.2, 0.3, length(c));
    float dusk = smoothstep(0.32, 0.62, uProgress);

    vec2 pc = (vUv - uPointer) * vec2(aspect, 1.0);
    float light = exp(-dot(pc, pc) * 2.6) * (0.05 + 0.07 * dusk);

    float frame = floor(uTime * 24.0);
    float grain = (hash(floor(vUv * uRes) + frame * 17.13) - 0.5) * 0.075;

    float g = 0.5 - (1.0 - vig) * 0.17 + grain;
    vec3 col = vec3(g) + vec3(light, light * 0.56, light * 0.22);
    col += vec3(0.045, 0.022, 0.0) * dusk * smoothstep(0.65, 0.0, vUv.y);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Finish({ state }: { state: MutableRefObject<FilmState> }) {
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.45) },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uRes.value.set(size.width * dpr, size.height * dpr);
  }, [size, dpr, uniforms]);

  useFrame((_, dt) => {
    const s = state.current;
    uniforms.uTime.value += Math.min(dt, 0.1);
    uniforms.uProgress.value += (s.progress - uniforms.uProgress.value) * 0.08;
    const p = uniforms.uPointer.value;
    p.x += (s.pointer[0] - p.x) * 0.05;
    p.y += (s.pointer[1] - p.y) * 0.05;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

export default function FilmFinish({ state }: { state: MutableRefObject<FilmState> }) {
  const [running, setRunning] = useState(true);

  // Stop the render loop entirely while the hero is off-screen.
  useEffect(() => {
    const id = window.setInterval(() => setRunning(state.current.active), 300);
    return () => window.clearInterval(id);
  }, [state]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light">
      <Canvas
        dpr={[1, 1.5]}
        flat
        linear
        frameloop={running ? "always" : "never"}
        gl={{ antialias: false, alpha: false, powerPreference: "low-power", depth: false, stencil: false }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Finish state={state} />
      </Canvas>
    </div>
  );
}
