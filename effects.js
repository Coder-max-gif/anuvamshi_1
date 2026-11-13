/* =====================================================================
   Effects layer for Northvale. Runs after main.js (module order).
   Every effect is skipped or simplified under prefers-reduced-motion,
   and pointer-only effects run only on fine (mouse) pointers.
   ===================================================================== */

const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(pointer: fine)").matches;
const lenis = () => window.__lenis || null;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------------- 1. Split headlines into words ---------------- */
const SPLIT_SELECTOR = ".hero-title, main .display, .display-sm, .statement, .statement-sm, .h-sec, .h-caps, .quote p";
function splitWords(el) {
  let i = 0;
  const walk = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of child.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.append(" "); continue; }
          const w = document.createElement("span"); w.className = "w";
          const wi = document.createElement("span"); wi.className = "wi"; wi.style.setProperty("--i", i++); wi.textContent = part;
          w.append(wi); frag.append(w);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR" && child.tagName !== "SMALL") {
        walk(child);
      }
    }
  };
  walk(el);
  el.classList.remove("reveal");
  el.classList.add("split");
}
const splits = [...document.querySelectorAll(SPLIT_SELECTOR)];
splits.forEach(splitWords);
root.classList.add("split-ready");
const hero = document.querySelector(".hero-title");
const splitIO = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); splitIO.unobserve(e.target); }
}, { threshold: 0.2 });
splits.filter((el) => el !== hero).forEach((el) => splitIO.observe(el));

/* ---------------- 2. Intro loader ---------------- */
const loader = document.querySelector(".loader");
function revealHero() { requestAnimationFrame(() => hero && hero.classList.add("in")); }
if (loader && root.classList.contains("has-loader")) {
  const countEl = loader.querySelector(".loader-count");
  const t0 = performance.now();
  let ready = !!window.__sceneReady, finished = false, shown = 0;
  window.addEventListener("scene-ready", () => { ready = true; }, { once: true });
  lenis()?.stop();
  const tick = (now) => {
    const elapsed = now - t0;
    const target = ready && elapsed > 1400 ? 100 : Math.min(92, elapsed / 18);
    shown += (target - shown) * 0.12;
    countEl.textContent = String(Math.round(shown)).padStart(3, "0");
    if (!finished && ((ready && elapsed > 1400 && shown > 99.4) || elapsed > 4500)) {
      finished = true;
      countEl.textContent = "100";
      loader.classList.add("done");
      root.classList.remove("is-loading");
      try { sessionStorage.setItem("nv-intro", "1"); } catch (e) {}
      lenis()?.start();
      setTimeout(revealHero, 350);
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
} else {
  root.classList.remove("is-loading");
  revealHero();
}

/* ---------------- 3. Scroll progress + auto-hide header ---------------- */
const bar = document.createElement("div");
bar.className = "progress"; bar.setAttribute("aria-hidden", "true");
document.body.append(bar);
const header = document.querySelector(".site-header");
const nav = document.getElementById("primary-nav");
let lastY = window.scrollY;
function scrollFx() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  const d = y - lastY;
  if (!reduce && !nav.classList.contains("open")) {
    if (d > 4 && y > window.innerHeight * 0.8) header.classList.add("hide");
    else if (d < -4 || y < 80) header.classList.remove("hide");
  }
  lastY = y;
}

/* ---------------- 4. Ticker band (velocity-reactive) ---------------- */
const track = document.querySelector(".ticker-track");
let tickX = 0, tickSkew = 0, tickDir = -1, tickVisible = false;
if (track) new IntersectionObserver(([e]) => { tickVisible = e.isIntersecting; }).observe(track);
function tickerFx() {
  if (!track || reduce || !tickVisible) return;
  const v = lenis()?.velocity ?? 0;
  if (Math.abs(v) > 0.5) tickDir = v > 0 ? -1 : 1;
  tickX += tickDir * (0.7 + Math.min(Math.abs(v) * 0.35, 18));
  const half = track.scrollWidth / 2;
  if (tickX <= -half) tickX += half;
  if (tickX > 0) tickX -= half;
  tickSkew += (clamp(-v * 0.35, -10, 10) - tickSkew) * 0.12;
  track.style.transform = `translate3d(${tickX}px,0,0) skewX(${tickSkew}deg)`;
}

/* ---------------- 4b. Interludes (pinned chapter titles) ----------------
   Progress p runs 0 -> 1 while the sticky stage is pinned. Word 1 arrives,
   then word 2, the meta line draws in, and the stage fades/lifts away as
   the next section scrolls up. Only visible interludes are updated. */
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const interludes = [...document.querySelectorAll(".interlude")].map((el) => ({
  el, stage: el.querySelector(".il-stage"), words: [...el.querySelectorAll(".il-w")], meta: el.querySelector(".il-meta"), on: false, last: -1,
}));
if (!reduce) {
  const ilIO = new IntersectionObserver((es) => { for (const e of es) { const it = interludes.find((x) => x.el === e.target); if (it) it.on = e.isIntersecting; } });
  interludes.forEach((it) => ilIO.observe(it.el));
}
function interludeFx() {
  if (reduce) return;
  const vh = window.innerHeight;
  for (const it of interludes) {
    if (!it.on) continue;
    const r = it.el.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
    if (Math.abs(p - it.last) < 0.0005) continue;
    it.last = p;
    it.words.forEach((w, i) => {
      const k = smooth(0.06 + i * 0.16, 0.3 + i * 0.16, p);
      w.style.opacity = k;
      w.style.transform = `translate3d(0,${(1 - k) * 0.35}em,0)`;
      w.style.filter = k > 0.99 ? "none" : `blur(${(1 - k) * 8}px)`;
    });
    const m = smooth(0.42, 0.6, p);
    it.meta.style.opacity = m;
    it.meta.style.setProperty("--il-line", m);
    const out = smooth(0.78, 1, p);
    it.stage.style.opacity = 1 - out;
    it.stage.style.transform = out ? `translate3d(0,${-out * 6}vh,0) scale(${1 - out * 0.04})` : "";
  }
}

/* ---------------- 4c. Founder stage (pinned, scroll-scrubbed) ----------------
   p: 0 when the stage pins -> 1 when it releases.
   - each word rises out of a mask with a slight tilt, scrubbed by scroll
   - the sentence drifts upward the whole time, then lifts away and fades at the end
   - the italic word gets a light sweep once revealed (CSS)
   - the name line draws, then the role and name slide in */
const founder = document.querySelector(".founder");
const fWords = [];
let fState = null, fNameEl = null;
if (founder) {
  fState = founder.querySelector(".f-statement");
  fNameEl = founder.querySelector(".f-name");
  const wrap = (node) => {
    for (const c of [...node.childNodes]) {
      if (c.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of c.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { frag.append(" "); continue; }
          const w = document.createElement("span"); w.className = "fw";
          const wi = document.createElement("span"); wi.className = "fwi"; wi.textContent = part;
          w.append(wi); fWords.push(wi); frag.append(w);
        }
        c.replaceWith(frag);
      } else if (c.nodeType === Node.ELEMENT_NODE) wrap(c);
    }
  };
  wrap(fState);
}
let fOn = false, fLast = -1;
if (founder && !reduce) new IntersectionObserver(([e]) => { fOn = e.isIntersecting; }).observe(founder);
function founderFx() {
  if (!fOn) return;
  const r = founder.getBoundingClientRect(), vh = window.innerHeight;
  const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
  const enter = clamp(1 - r.top / vh, 0, 1);
  const key = p + enter * 2;
  if (Math.abs(key - fLast) < 0.0002) return;
  fLast = key;
  founder.style.setProperty("--f-cy", `${(1 - smooth(0.3, 1, enter)) * 30}vh`);
  founder.style.setProperty("--f-light", (0.55 + 0.45 * smooth(0.4, 1, enter)).toFixed(3));

  // Words: scrubbed rise, overlapping so several move at once.
  const n = fWords.length, span = 0.55, start = 0.02;
  fWords.forEach((w, i) => {
    const a = start + (i / n) * span * 0.75;
    const k = smooth(a, a + span * 0.35, p);
    w.style.transform = k >= 1 ? "none" : `translate3d(0,${(1 - k) * 105}%,0) rotate(${(1 - k) * 6}deg)`;
    w.style.opacity = (0.15 + 0.85 * k).toFixed(3);
  });
  fState.classList.toggle("lit", p > start + span + 0.02);

  // Sentence drift + exit.
  const out = smooth(0.82, 1, p);
  fState.style.transform = `translate3d(0,${(0.5 - p) * 6 - out * 10}vh,0) scale(${1 - out * 0.06})`;
  fState.style.opacity = (1 - out).toFixed(3);

  // Name: line draws, then text slides in.
  const nm = smooth(0.58, 0.8, p);
  founder.style.setProperty("--f-name", nm.toFixed(3));
  founder.style.setProperty("--f-line", smooth(0.55, 0.7, p).toFixed(3));
}

/* ---------------- 5. Compounding stats + chart (deterministic, illustrative maths) ----------------
   Rs 10,000 invested at the start of each month for 20 years, at constant assumed annual rates,
   compounded monthly. Values are in lakhs (1 L = Rs 1,00,000). */
function series() {
  const months = 240, sip = 10000 / 1e5, rE = 0.12 / 12, rS = 0.04 / 12;
  const strat = [0], bench = [0], paid = [0];
  for (let m = 1; m <= months; m++) {
    strat.push((strat.at(-1) + sip) * (1 + rE));
    bench.push((bench.at(-1) + sip) * (1 + rS));
    paid.push(paid.at(-1) + sip);
  }
  return { strat, bench, paid, years: months / 12 };
}
const chartFig = document.querySelector(".chart");
if (chartFig) {
  const d = series();
  // Stats derived from the same series, so numbers and chart agree.
  const set = (key, val) => { const el = document.querySelector(`[data-stat="${key}"]`); if (el) el.dataset.to = val; };
  set("invested", d.paid.at(-1).toFixed(0)); set("equity", d.strat.at(-1).toFixed(1)); set("savings", d.bench.at(-1).toFixed(1)); set("years", d.years);

  const W = 1000, H = 380, P = { l: 48, r: 16, t: 16, b: 32 };
  const lo = 0, hi = Math.ceil(Math.max(...d.strat) / 25) * 25;
  const x = (i) => P.l + (i / (d.strat.length - 1)) * (W - P.l - P.r);
  const y = (v) => P.t + (1 - (v - lo) / (hi - lo)) * (H - P.t - P.b);
  const line = (arr) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  let grid = "", axis = "";
  for (let v = lo; v <= hi; v += (hi - lo) / 4) { grid += `<line x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}"/>`; axis += `<text x="${P.l - 10}" y="${y(v) + 4}" text-anchor="end">${Math.round(v)}L</text>`; }
  for (let yr = 0; yr <= 20; yr += 5) axis += `<text x="${x(yr * 12)}" y="${H - 8}" text-anchor="middle">Year ${yr}</text>`;
  const last = d.strat.length - 1;
  chartFig.querySelector("svg").innerHTML = `
    <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb3ff" stop-opacity=".28"/><stop offset="1" stop-color="#8fb3ff" stop-opacity="0"/></linearGradient></defs>
    <g class="grid">${grid}</g><g class="axis">${axis}</g>
    <path class="area" d="${line(d.strat)}L${x(last)},${H - P.b}L${x(0)},${H - P.b}Z"/>
    <path class="bench draw" d="${line(d.bench)}"/>
    <path class="strat draw" d="${line(d.strat)}"/>
    <circle class="end-dot" cx="${x(last)}" cy="${y(d.strat[last])}" r="5"/>
    <g class="crosshair"><line y1="${P.t}" y2="${H - P.b}"/><circle r="4.5"/></g>
    <rect class="hit" x="${P.l}" y="${P.t}" width="${W - P.l - P.r}" height="${H - P.t - P.b}" fill="transparent"/>`;
  // Stroke draw-on: start hidden, reveal on view.
  for (const p of chartFig.querySelectorAll(".draw")) {
    const len = p.getTotalLength();
    p.style.strokeDasharray = p.classList.contains("bench") ? "4 5" : `${len}`;
    if (p.classList.contains("strat")) p.style.strokeDashoffset = reduce ? 0 : len;
    else { p.style.opacity = reduce ? 1 : 0; p.style.transition = "opacity 1.2s ease .2s"; }
  }
  // Hover crosshair + tooltip
  const svg = chartFig.querySelector("svg"), tip = chartFig.querySelector(".chart-tip");
  const cross = svg.querySelector(".crosshair"), cl = cross.querySelector("line"), cc = cross.querySelector("circle");
  const move = (clientX) => {
    const r = svg.getBoundingClientRect();
    const sx = ((clientX - r.left) / r.width) * W;
    const i = clamp(Math.round(((sx - P.l) / (W - P.l - P.r)) * last), 0, last);
    cl.setAttribute("x1", x(i)); cl.setAttribute("x2", x(i)); cc.setAttribute("cx", x(i)); cc.setAttribute("cy", y(d.strat[i]));
    tip.style.left = `${(x(i) / W) * r.width}px`; tip.style.top = `${(y(d.strat[i]) / H) * r.height}px`;
    tip.innerHTML = `<b>Year ${(i / 12).toFixed(1)}</b><br/>At 12%: ₹${d.strat[i].toFixed(1)}L · At 4%: ₹${d.bench[i].toFixed(1)}L<br/>You invested ₹${d.paid[i].toFixed(1)}L`;
    chartFig.classList.add("hovering");
  };
  svg.addEventListener("pointermove", (e) => move(e.clientX));
  svg.addEventListener("pointerleave", () => chartFig.classList.remove("hovering"));

  const countUp = (el) => {
    const to = parseFloat(el.dataset.to), dec = (el.dataset.to.split(".")[1] || "").length;
    const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    if (reduce) { el.textContent = pre + to.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1800;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = pre + (to * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statIO = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { countUp(e.target); statIO.unobserve(e.target); }
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-stat]").forEach((el) => statIO.observe(el));
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return;
    chartFig.classList.add("in");
    chartFig.querySelector(".strat").style.strokeDashoffset = 0;
    chartFig.querySelector(".bench").style.opacity = 1;
    o.disconnect();
  }, { threshold: 0.35 }).observe(chartFig);
}

/* ---------------- 6. Pointer effects: cursor ring, magnetic, tilt ---------------- */
if (fine && !reduce) {
  const ring = document.createElement("div");
  ring.className = "cursor"; ring.setAttribute("aria-hidden", "true");
  document.body.append(ring);
  const m = { x: -100, y: -100 }, c = { x: -100, y: -100 };
  window.addEventListener("pointermove", (e) => {
    m.x = e.clientX; m.y = e.clientY; ring.classList.add("on");
    ring.classList.toggle("hover", !!e.target.closest("a, button"));
    ring.classList.toggle("hidden", !!e.target.closest(".chart svg, .offers a")); // chart has its own crosshair
  }, { passive: true });
  document.addEventListener("pointerleave", () => ring.classList.remove("on"));
  window.addEventListener("pointerdown", () => ring.classList.add("down"));
  window.addEventListener("pointerup", () => ring.classList.remove("down"));
  const follow = () => {
    c.x += (m.x - c.x) * 0.2; c.y += (m.y - c.y) * 0.2;
    ring.style.transform = `translate3d(${c.x}px,${c.y}px,0)`;
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);

  // Magnetic pull
  for (const el of document.querySelectorAll(".cta, nav a, .social a, .foot-links a")) {
    el.classList.add("magnetic");
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.classList.add("pull");
      el.style.transform = `translate(${dx * 0.28}px, ${dy * 0.35}px)`;
    });
    el.addEventListener("pointerleave", () => { el.classList.remove("pull"); el.style.transform = ""; });
  }

  // 3D tilt + spotlight
  for (const el of document.querySelectorAll(".tiles a, .cards a")) {
    el.classList.add("tilt");
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`); el.style.setProperty("--my", `${py * 100}%`);
      el.classList.add("active");
      el.style.transform = `perspective(700px) rotateX(${(0.5 - py) * 9}deg) rotateY(${(px - 0.5) * 11}deg) translateZ(6px)`;
    });
    el.addEventListener("pointerleave", () => { el.classList.remove("active"); el.style.transform = ""; });
  }
}

/* ---------------- 7. Offer rows: cursor-following preview card ----------------
   One floating card per .offers list. It eases toward the pointer, tilts with
   horizontal speed and swaps its glyph/tag for the hovered row. */
for (const list of document.querySelectorAll(".offers")) {
  const card = document.createElement("div");
  card.className = "o-preview"; card.setAttribute("aria-hidden", "true");
  card.innerHTML = '<span class="o-glyph"></span><span class="o-tag"></span><span class="o-go">Open →</span>';
  list.append(card);
  if (!fine || reduce) continue;
  const g = card.querySelector(".o-glyph"), t = card.querySelector(".o-tag");
  const p = { x: 0, y: 0 }, c = { x: 0, y: 0 }; let raf = 0, active = false;
  const tick = () => {
    const dx = p.x - c.x;
    c.x += dx * 0.14; c.y += (p.y - c.y) * 0.14;
    card.style.transform = `translate3d(${c.x}px,${c.y}px,0) translate(-50%,-50%) rotate(${clamp(dx * 0.06, -12, 12)}deg)`;
    raf = active || Math.abs(dx) > 0.5 ? requestAnimationFrame(tick) : 0;
  };
  list.addEventListener("pointermove", (e) => {
    const r = list.getBoundingClientRect();
    p.x = e.clientX - r.left; p.y = e.clientY - r.top;
    const a = e.target.closest("a");
    if (a) { g.textContent = a.dataset.glyph || "α"; t.textContent = a.dataset.tag || ""; }
    if (!active) { active = true; if (!c.x && !c.y) { c.x = p.x; c.y = p.y; } }
    card.classList.toggle("show", !!a);
    if (!raf) raf = requestAnimationFrame(tick);
  });
  list.addEventListener("pointerleave", () => { active = false; card.classList.remove("show"); });
}

/* ---------------- Loop ---------------- */
function loop() { scrollFx(); tickerFx(); interludeFx(); founderFx(); requestAnimationFrame(loop); }
requestAnimationFrame(loop);
