import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/* =========================================================================
   Northvale: scroll-driven WebGL scene.
   - A procedural 3D alpha (α) glyph replaces the DNA helix.
   - A liquid glass orb (glass shell + chrome core, noise-displaced).
   - A closing ring of six alphas.
   Light sections are transparent so the fixed canvas shows through; navy
   sections are opaque and cover it, which hides transitions between states.
   ========================================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const canvas = document.getElementById("stage");
const header = document.querySelector(".site-header");
const sections = [...document.querySelectorAll("[data-scene]")];

// Start the scroll story from the top on reload, unless a #section link was opened.
if ("scrollRestoration" in history && !location.hash) { history.scrollRestoration = "manual"; window.scrollTo(0, 0); }

/* ---------------- Smooth scroll (Lenis) ---------------- */
let lenis = null;
if (!reduceMotion && window.Lenis) {
  lenis = new window.Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  window.__lenis = lenis; // shared with effects.js (ticker velocity, loader lock)
}
// In-page links: smooth-scroll and close the mobile menu.
const nav = document.getElementById("primary-nav");
const toggle = document.querySelector(".menu-toggle");
function setMenu(open) {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
  if (lenis) open ? lenis.stop() : lenis.start();
}
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); } });
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#") { e.preventDefault(); return; }
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    if (lenis) lenis.scrollTo(target, { offset: 0 }); else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    history.replaceState(null, "", id);
  });
});

/* ---------------- Reveal on view ---------------- */
const io = new IntersectionObserver((entries) => {
  for (const en of entries) if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------------- Header: theme + compact logo ---------------- */
function updateHeader() {
  const probe = 44;
  let dark = false;
  for (const s of document.querySelectorAll(".section")) {
    const r = s.getBoundingClientRect();
    if (r.top <= probe && r.bottom > probe) { dark = s.classList.contains("navy"); break; }
  }
  header.dataset.theme = dark ? "dark" : "light";
  header.classList.toggle("compact", window.scrollY > window.innerHeight * 0.6);
}

/* ---------------- WebGL ---------------- */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
} catch (err) {
  canvas.remove();
  document.body.classList.add("no-webgl");
}

if (renderer) {
  renderer.setClearColor(0x000000, 0); // transparent: the CSS paper colour shows behind, so colours match exactly
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  /* Navy + white studio environment, so metal reflects the brand colours. */
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(buildEnvScene(), 0.03).texture;

  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(3, 4, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7fa6ff, 2.0); rim.position.set(-6, 2, -4); scene.add(rim);

  /* ---- Alpha glyph (procedural, tapered tube along a nodal-cubic curve) ---- */
  const alphaGeo = buildAlphaGeometry();
  const silver = new THREE.MeshPhysicalMaterial({ color: 0xe9eef6, metalness: 1, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.25 });
  const alpha = new THREE.Mesh(alphaGeo, silver);
  scene.add(alpha);

  /* ---- Liquid orb: glass shell + chrome core ---- */
  const orb = new THREE.Group();
  const orbUniforms = { uTime: { value: 0 } };
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.06, transmission: 1, ior: 1.6, thickness: 1.4,
    clearcoat: 1, clearcoatRoughness: 0.05, attenuationColor: new THREE.Color(0xb9cbec), attenuationDistance: 3,
  });
  liquify(glass, orbUniforms, 0.085, 0.95);
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 48), glass);
  const coreMat = new THREE.MeshPhysicalMaterial({ color: 0x0b1d3a, metalness: 0.95, roughness: 0.05 });
  liquify(coreMat, orbUniforms, 0.12, 1.15);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 32), coreMat);
  orb.add(shell, core);
  scene.add(orb);

  /* ---- Closing ring of six alphas ---- */
  const ring = new THREE.Group();
  for (let k = 0; k < 6; k++) {
    const pivot = new THREE.Group();
    pivot.rotation.z = (k / 6) * Math.PI * 2;
    const m = new THREE.Mesh(alphaGeo, silver);
    m.position.set(2.9, 0, 0);
    m.rotation.set(0.3, 0, Math.PI / 2);
    m.scale.setScalar(1.05);
    pivot.add(m);
    ring.add(pivot);
  }
  scene.add(ring);

  /* ---- Data-dust particles: drift upward, parallax with scroll, depth-sized ---- */
  const PCOUNT = finePointer ? 1400 : 650;
  const pPos = new Float32Array(PCOUNT * 3), pSeed = new Float32Array(PCOUNT);
  for (let i = 0; i < PCOUNT; i++) {
    pPos[i * 3] = (Math.random() * 2 - 1) * 9;
    pPos[i * 3 + 1] = (Math.random() * 2 - 1) * 6;
    pPos[i * 3 + 2] = -7 + Math.random() * 9;
    pSeed[i] = Math.random();
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("aSeed", new THREE.BufferAttribute(pSeed, 1));
  const pMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uScroll: { value: 0 }, uPR: { value: 1 }, uColor: { value: new THREE.Color(0x1d3b6e) } },
    vertexShader: `
      attribute float aSeed; uniform float uTime, uScroll, uPR; varying float vA;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * 0.2 + aSeed * 20.0) * 0.35;
        p.y = mod(p.y + uTime * 0.07 * (0.3 + aSeed) + uScroll * (0.4 + aSeed * 0.9) + 6.0, 12.0) - 6.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (2.0 + aSeed * 3.5) * uPR * (8.0 / -mv.z);
        vA = (0.18 + 0.5 * aSeed) * (0.75 + 0.25 * sin(uTime * 1.5 + aSeed * 40.0));
      }`,
    fragmentShader: `
      uniform vec3 uColor; varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vA);
        #include <colorspace_fragment>
      }`,
  });
  const dust = new THREE.Points(pGeo, pMat);
  dust.frustumCulled = false;
  scene.add(dust);

  /* ---- Scene states, chosen by the section in the middle of the viewport ---- */
  const OFF = 9;
  const STATES = {
    hero:  { a: [0.35, -0.05, 0], as: 2.55, ar: 0,             o: [0, -OFF, 0], os: 1,    rs: 0, core: 0x0b1d3a },
    turn:  { a: [-2.7, 1.0, 0.6], as: 3.3,  ar: Math.PI * 0.9, o: [0, -OFF, 0], os: 1,    rs: 0, core: 0x0b1d3a },
    empty: { a: [0, OFF, 0],      as: 2.2,  ar: Math.PI * 1.2, o: [0, -OFF, 0], os: 1,    rs: 0, core: 0x0b1d3a },
    quote: { a: [0, 2.15, 0],     as: 2.0,  ar: Math.PI * 2,   o: [0, -OFF, 0], os: 1,    rs: 0, core: 0x0b1d3a },
    orb:   { a: [0, OFF, 0],      as: 2.0,  ar: Math.PI * 2.4, o: [0, 0.55, 0], os: 1.15, rs: 0, core: 0xe6ecf7 },
    ring:  { a: [0, OFF, 0],      as: 2.0,  ar: Math.PI * 2.4, o: [0, -OFF, 0], os: 1,    rs: 1, core: 0x0b1d3a },
  };
  const cur = { a: new THREE.Vector3(0.35, -0.05, 0), as: 2.55, ar: 0, o: new THREE.Vector3(0, -OFF, 0), os: 1, rs: 0, core: new THREE.Color(0x0b1d3a) };
  const tmpV = new THREE.Vector3(), tmpC = new THREE.Color();

  function activeState() {
    const mid = window.innerHeight / 2;
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) return STATES[s.dataset.scene] || STATES.empty;
    }
    return window.scrollY < 10 ? STATES.hero : STATES.ring;
  }
  // Skip rendering while only navy (opaque) sections cover the viewport.
  function canvasVisible() {
    const h = window.innerHeight;
    for (const s of sections) {
      if (s.classList.contains("navy")) continue;
      const r = s.getBoundingClientRect();
      if (r.bottom > 0 && r.top < h) return true;
    }
    return document.querySelector(".site-footer").getBoundingClientRect().top < h;
  }

  /* ---- Sizing: cap pixel ratio at 2 so 3D is crisp on retina without melting GPUs ---- */
  // Per-viewport framing so the orb and ring never sit on top of their text.
  const vp = { oy: 0, os: 1, rs: 1 };
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    const short = w / h >= 1 && h < 560, narrow = w / h < 0.62;
    vp.oy = short ? 0.75 : w / h < 1 ? 0.55 : 0;
    vp.os = short ? 0.6 : w / h < 1 ? 0.88 : 1;
    vp.rs = short ? 0.78 : narrow ? 1.12 : w / h < 1 ? 0.8 : 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    pMat.uniforms.uPR.value = renderer.getPixelRatio();
    camera.aspect = w / h;
    camera.fov = camera.aspect < 1 ? 42 : 35;
    camera.position.z = camera.aspect >= 1 ? 9 : 9 * Math.min(1.9, 0.82 / camera.aspect);
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---- Pointer parallax (desktop only) ---- */
  const pointer = { x: 0, y: 0 }, ps = { x: 0, y: 0 };
  let velTilt = 0;
  if (finePointer && !reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  /* ---- Loop ---- */
  const clock = new THREE.Clock();
  let time = 0;
  function frame(now) {
    if (lenis) lenis.raf(now);
    updateHeader();
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!reduceMotion) time += dt;

    const st = activeState();
    const k = reduceMotion ? 1 : 1 - Math.exp(-dt * 3.2); // frame-rate independent easing
    cur.a.lerp(tmpV.set(...st.a), k);
    cur.as += (st.as - cur.as) * k;
    cur.ar += (st.ar - cur.ar) * k;
    cur.o.lerp(tmpV.set(...st.o), k);
    cur.os += (st.os - cur.os) * k;
    cur.rs += (st.rs - cur.rs) * k;
    cur.core.lerp(tmpC.set(st.core), k * 0.8);

    if (canvasVisible()) {
      // Faces the camera and sways; the big turns come from scroll-state changes (cur.ar).
      alpha.position.copy(cur.a);
      alpha.position.y += Math.sin(time * 0.6) * 0.06;
      alpha.scale.setScalar(cur.as);
      alpha.rotation.set(Math.sin(time * 0.4) * 0.12, cur.ar + Math.sin(time * 0.35) * 0.42, -0.12 + Math.sin(time * 0.3) * 0.05);
      // Lean toward the cursor, and tilt with scroll speed.
      ps.x += (pointer.x - ps.x) * 0.06; ps.y += (pointer.y - ps.y) * 0.06;
      const vel = lenis ? lenis.velocity : 0;
      velTilt += (Math.max(-0.35, Math.min(0.35, vel * 0.01)) - velTilt) * 0.08;
      alpha.rotation.x += ps.y * 0.28;
      alpha.rotation.y += ps.x * 0.45;
      alpha.rotation.z += velTilt;
      ring.rotation.x = ps.y * 0.18; ring.rotation.y = ps.x * 0.22;

      pMat.uniforms.uTime.value = time;
      pMat.uniforms.uScroll.value = (lenis ? lenis.animatedScroll : window.scrollY) * 0.0011;
      alpha.visible = cur.a.y < OFF - 0.5;

      orbUniforms.uTime.value = time;
      orb.position.copy(cur.o); orb.position.y += vp.oy;
      orb.scale.setScalar(cur.os * vp.os);
      orb.rotation.set(time * 0.07, time * 0.11, 0);
      orb.visible = cur.o.y > -OFF + 0.5;
      coreMat.color.copy(cur.core);

      ring.visible = cur.rs > 0.01;
      ring.scale.setScalar((0.55 + cur.rs * 0.45) * vp.rs);
      ring.rotation.z = time * 0.05;
      ring.children.forEach((p, i) => { p.children[0].rotation.y = Math.sin(time * 0.45 + i * 1.3) * 0.55; });

      camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.05;
      camera.position.y += (-pointer.y * 0.2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (!window.__sceneReady) { window.__sceneReady = true; window.dispatchEvent(new Event("scene-ready")); }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
} else {
  // No WebGL: keep the site fully usable with a static typographic alpha.
  const fb = document.createElement("div");
  fb.className = "fallback-alpha"; fb.setAttribute("aria-hidden", "true"); fb.textContent = "α";
  document.body.prepend(fb);
  window.__sceneReady = true;
  window.dispatchEvent(new Event("scene-ready"));
  const loop = (now) => { if (lenis) lenis.raf(now); updateHeader(); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}

/* =========================================================================
   Geometry + materials
   ========================================================================= */

/** Alpha glyph: a tapered tube swept along the nodal cubic x = t²−1, y = t(t²−1),
 *  which naturally forms α (loop on the left, two tails to the right). */
function buildAlphaGeometry() {
  const T = 1.18, N = 240;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const t = -T + (2 * T * i) / N;
    pts.push(new THREE.Vector3(t * t - 1, t * (t * t - 1) * 1.25, 0.34 * t)); // z offset lifts one stroke over the other at the crossing
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  const tubular = 360, radial = 40, R = 0.165;
  const radiusAt = (u) => R * (0.28 + 0.72 * Math.pow(Math.sin(Math.PI * u), 0.55)); // thick at the bowl, tapering to the tails
  const tube = new THREE.TubeGeometry(curve, tubular, 1, radial, false);
  const pos = tube.attributes.position;
  const c = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const u = i / tubular;
    curve.getPointAt(u, c);
    const r = radiusAt(u);
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, idx).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  // Rounded end caps
  const capR = radiusAt(0);
  const capA = new THREE.SphereGeometry(capR, 24, 16).translate(...curve.getPointAt(0).toArray());
  const capB = new THREE.SphereGeometry(capR, 24, 16).translate(...curve.getPointAt(1).toArray());
  const geo = mergeGeometries([tube, capA, capB]);
  geo.computeBoundingBox();
  const center = geo.boundingBox.getCenter(new THREE.Vector3());
  geo.translate(-center.x, -center.y, -center.z);
  return geo;
}

/** Studio environment: navy room with soft white light panels. */
function buildEnvScene() {
  const env = new THREE.Scene();
  const room = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x0f2347, side: THREE.BackSide }));
  env.add(room);
  const panel = (w, h, intensity, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(intensity, intensity, intensity * 1.04) }));
    m.position.set(...pos); m.rotation.set(...rot); env.add(m);
  };
  panel(14, 4, 6, [0, 9.5, 0], [Math.PI / 2, 0, 0]);      // top softbox
  panel(3, 12, 4, [-9.5, 0, 2], [0, Math.PI / 2, 0]);     // left strip
  panel(3, 12, 3, [9.5, 1, -2], [0, -Math.PI / 2, 0]);    // right strip
  panel(10, 3, 2.2, [0, -2, 9.5], [0, Math.PI, 0]);       // front fill
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({ color: 0xdfe6f2 }));
  floor.position.y = -9.8; floor.rotation.x = -Math.PI / 2; env.add(floor);
  return env;
}

/** Animated simplex-noise displacement along the sphere normal, with recomputed normals. */
function liquify(material, uniforms, amp, freq) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>
        uniform float uTime;
        vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
        vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
        vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
        float snoise(vec3 v){
          const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
          vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
          vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
          vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
          i=mod289(i);
          vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
          float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
          vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
          vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
          vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
          vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
          vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
          vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
          vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
          vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
          return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }
        vec3 disp(vec3 p){
          float n = snoise(p * ${freq.toFixed(2)} + vec3(0., uTime * 0.28, uTime * 0.17));
          n += 0.18 * snoise(p * ${(freq * 1.9).toFixed(2)} - vec3(uTime * 0.15));
          return p * (1.0 + ${amp.toFixed(3)} * n);
        }`)
      .replace("#include <beginnormal_vertex>", `
        vec3 nn = normalize(position); float RR = length(position);
        vec3 tA = normalize(abs(nn.y) < 0.99 ? cross(nn, vec3(0.,1.,0.)) : cross(nn, vec3(1.,0.,0.)));
        vec3 tB = normalize(cross(nn, tA));
        vec3 d0 = disp(position);
        vec3 d1 = disp(normalize(position + tA * 0.01) * RR);
        vec3 d2 = disp(normalize(position + tB * 0.01) * RR);
        vec3 objectNormal = normalize(cross(d1 - d0, d2 - d0));
        if (dot(objectNormal, nn) < 0.) objectNormal = -objectNormal;`)
      .replace("#include <begin_vertex>", "vec3 transformed = d0;");
  };
}
