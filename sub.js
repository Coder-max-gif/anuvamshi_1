/* =====================================================================
   Subpage behaviour. Everything degrades: without JS the content is
   readable; with reduced motion, animation-only effects are skipped.
   ===================================================================== */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(pointer: fine)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const inr = (v) => "₹" + Math.round(v).toLocaleString("en-IN");
const lakh = (v) => (v >= 1e7 ? `₹${(v / 1e7).toFixed(2)} Cr` : `₹${(v / 1e5).toFixed(1)} L`);

/* ---------- Smooth scroll ---------- */
let lenis = null;
if (!reduce && window.Lenis) {
  lenis = new window.Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
$$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
  const t = $(a.getAttribute("href")); if (!t) return;
  e.preventDefault(); lenis ? lenis.scrollTo(t, { offset: -80 }) : t.scrollIntoView();
}));

/* ---------- Header: theme over navy, compact, auto-hide, mobile menu ---------- */
const header = $(".site-header"), nav = $("#primary-nav"), toggle = $(".menu-toggle");
const bar = document.createElement("div"); bar.className = "progress"; bar.setAttribute("aria-hidden", "true"); document.body.append(bar);
let lastY = scrollY;
function onScroll() {
  const y = scrollY, probe = 40;
  let dark = false;
  for (const s of $$("main > section, .site-footer")) { const r = s.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) { dark = s.classList.contains("navy"); break; } }
  header.dataset.theme = dark ? "dark" : "light";
  header.classList.toggle("compact", y > 60);
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  if (!reduce && !nav.classList.contains("open")) {
    if (y - lastY > 4 && y > innerHeight * 0.6) header.classList.add("hide");
    else if (y - lastY < -4 || y < 80) header.classList.remove("hide");
  }
  lastY = y;
  stepsFx();
}
addEventListener("scroll", onScroll, { passive: true });
toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", open); nav.classList.toggle("open", open);
  open ? lenis?.stop() : lenis?.start();
});
addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) toggle.click(); });

/* ---------- Split headlines + reveals ---------- */
for (const el of $$(".s-title, .h2, .nx-title")) {
  let i = 0;
  const walk = (node) => {
    for (const c of [...node.childNodes]) {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        for (const part of c.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { f.append(" "); continue; }
          const w = document.createElement("span"); w.className = "w";
          const wi = document.createElement("span"); wi.className = "wi"; wi.style.setProperty("--i", i++); wi.textContent = part;
          w.append(wi); f.append(w);
        }
        c.replaceWith(f);
      } else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
    }
  };
  walk(el); el.classList.add("split");
}
const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
$$(".reveal, .split, .letter").forEach((el) => (reduce ? el.classList.add("in") : io.observe(el)));

/* ---------- Hero alpha follows the pointer ---------- */
const alpha = $(".s-alpha");
if (alpha && fine && !reduce) addEventListener("pointermove", (e) => {
  const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
  alpha.style.setProperty("--ax", `${x * -30}px`); alpha.style.setProperty("--ay", `${y * -20}px`); alpha.style.setProperty("--ar", `${x * 6}deg`);
}, { passive: true });

/* ---------- Tabs ---------- */
for (const tl of $$("[role=tablist]")) {
  const tabs = $$("[role=tab]", tl);
  const show = (t) => {
    tabs.forEach((x) => { const on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute("aria-controls")); p.hidden = !on; if (on) { p.classList.remove("enter"); void p.offsetWidth; p.classList.add("enter"); } });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => show(t));
    t.addEventListener("keydown", (e) => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); show(n); } });
  });
}

/* ---------- Filters ---------- */
for (const fl of $$("[data-filter-for]")) {
  const grid = document.getElementById(fl.dataset.filterFor);
  fl.addEventListener("click", (e) => {
    const b = e.target.closest(".filter"); if (!b) return;
    $$(".filter", fl).forEach((x) => x.setAttribute("aria-pressed", x === b));
    const k = b.dataset.f;
    for (const li of grid.children) li.classList.toggle("out", k !== "all" && !li.dataset.k.split(" ").includes(k));
  });
}

/* ---------- Range fill helper ---------- */
const fill = (r) => r.style.setProperty("--fill", `${((r.value - r.min) / (r.max - r.min)) * 100}%`);

/* ---------- SIP calculator ---------- */
const sip = $("[data-calc=sip]");
if (sip) {
  const f = (n) => $(`[name=${n}]`, sip);
  const run = () => {
    const P = +f("amt").value, yrs = +f("yrs").value, r = +f("ret").value / 100 / 12, n = yrs * 12;
    const fv = r ? P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : P * n, inv = P * n;
    $("[data-o=amt]", sip).textContent = inr(P); $("[data-o=yrs]", sip).textContent = `${yrs} yrs`; $("[data-o=ret]", sip).textContent = `${f("ret").value}%`;
    $("[data-o=fv]", sip).textContent = lakh(fv); $("[data-o=inv]", sip).textContent = lakh(inv); $("[data-o=gain]", sip).textContent = lakh(fv - inv);
    $("[data-b=inv]", sip).style.setProperty("--w", `${(inv / fv) * 100}%`); $("[data-b=gain]", sip).style.setProperty("--w", `${((fv - inv) / fv) * 100}%`);
    $$("input[type=range]", sip).forEach(fill);
  };
  sip.addEventListener("input", run); run();
}

/* ---------- DCF playground ---------- */
const dcf = $("[data-calc=dcf]");
if (dcf) {
  const f = (n) => +$(`[name=${n}]`, dcf).value;
  const value = (g, m, w, tg) => {
    let rev = 1000, pv = 0, fcf = 0; // base revenue 1,000 (₹ crore, illustrative)
    for (let t = 1; t <= 5; t++) { rev *= 1 + g / 100; fcf = rev * (m / 100) * 0.75; pv += fcf / Math.pow(1 + w / 100, t); }
    const tv = (fcf * (1 + tg / 100)) / (w / 100 - tg / 100);
    return pv + tv / Math.pow(1 + w / 100, 5);
  };
  const grid = $(".sens", dcf), tgs = [2, 3, 4, 5];
  const run = () => {
    const g = f("g"), m = f("m"), w = f("w"), tg = f("tg");
    $("[data-o=g]", dcf).textContent = `${g}%`; $("[data-o=m]", dcf).textContent = `${m}%`; $("[data-o=w]", dcf).textContent = `${w}%`; $("[data-o=tg]", dcf).textContent = `${tg}%`;
    const v = value(g, m, w, tg);
    $("[data-o=ev]", dcf).textContent = `₹${Math.round(v).toLocaleString("en-IN")} Cr`;
    $("[data-b=ev]", dcf).style.setProperty("--w", `${clamp(v / 16000, 0, 1) * 100}%`);
    // Sensitivity grid: rows = terminal growth, columns = discount rate (value in ₹ thousand crore).
    const ws = [w - 1, w, w + 1, w + 2];
    let h = '<span class="hd">g \\ r</span>' + ws.map((x) => `<span class="hd">${x}%</span>`).join("");
    for (const t of tgs) { h += `<span class="hd">${t}%</span>`; for (const x of ws) h += `<span class="${x === w && t === tg ? "on" : ""}">${(value(g, m, x, t) / 1000).toFixed(1)}k</span>`; }
    grid.innerHTML = h;
    $$("input[type=range]", dcf).forEach(fill);
  };
  dcf.addEventListener("input", run); run();
}

/* ---------- Newsletter signup ----------
   Set data-endpoint on the form to your provider's subscribe URL (Substack,
   Mailchimp, ConvertKit...). Without one, it only shows the success state. */
for (const form of $$("form.signup")) {
  const msg = form.parentElement.querySelector(".signup-msg");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Please enter a valid email address."; form.email.focus(); return; }
    const ep = form.dataset.endpoint;
    try { if (ep) await fetch(ep, { method: "POST", body: new FormData(form), mode: "no-cors" }); else console.warn("Signup form has no data-endpoint yet; nothing was sent."); } catch (err) {}
    form.classList.add("done"); form.email.value = ""; msg.textContent = "You’re on the list. Welcome to The Alpha Letter.";
  });
}

/* ---------- Steps line draws with scroll ---------- */
const stepsEls = $$(".steps");
function stepsFx() {
  for (const s of stepsEls) {
    const r = s.getBoundingClientRect(), p = clamp((innerHeight * 0.65 - r.top) / r.height, 0, 1);
    s.style.setProperty("--sp", p.toFixed(3));
    for (const li of s.children) li.classList.toggle("done", li.getBoundingClientRect().top < innerHeight * 0.65);
  }
}

/* ---------- Pointer effects ---------- */
for (const el of $$(".big-cta, .map article")) el.addEventListener("pointermove", (e) => {
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`); el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
});
const letter = $(".letter");
if (letter && fine && !reduce) {
  const st = letter.parentElement;
  st.addEventListener("pointermove", (e) => { const r = st.getBoundingClientRect(); letter.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`); letter.style.setProperty("--rx", `${(0.5 - (e.clientY - r.top) / r.height) * 12}deg`); });
  st.addEventListener("pointerleave", () => { letter.style.removeProperty("--rx"); letter.style.removeProperty("--ry"); });
}
if (fine && !reduce) {
  const ring = document.createElement("div"); ring.className = "cursor"; ring.setAttribute("aria-hidden", "true"); document.body.append(ring);
  const m = { x: -100, y: -100 }, c = { x: -100, y: -100 };
  addEventListener("pointermove", (e) => { m.x = e.clientX; m.y = e.clientY; ring.classList.add("on"); ring.classList.toggle("hover", !!e.target.closest("a, button, summary, input, label")); }, { passive: true });
  document.addEventListener("pointerleave", () => ring.classList.remove("on"));
  addEventListener("pointerdown", () => ring.classList.add("down")); addEventListener("pointerup", () => ring.classList.remove("down"));
  const follow = () => { c.x += (m.x - c.x) * 0.2; c.y += (m.y - c.y) * 0.2; ring.style.transform = `translate3d(${c.x}px,${c.y}px,0)`; requestAnimationFrame(follow); };
  requestAnimationFrame(follow);
  for (const el of $$(".btn, nav a, .social a, .back")) {
    el.classList.add("magnetic");
    el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); el.classList.add("pull"); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`; });
    el.addEventListener("pointerleave", () => { el.classList.remove("pull"); el.style.transform = ""; });
  }
  for (const el of $$(".card, .feat article")) {
    el.classList.add("tilt");
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`); el.style.setProperty("--my", `${py * 100}%`); el.classList.add("active");
      el.style.transform = `perspective(800px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateZ(4px)`;
    });
    el.addEventListener("pointerleave", () => { el.classList.remove("active"); el.style.transform = ""; });
  }
}
onScroll();

/* ---------- Instagram strip: show only images that exist ---------- */
for (const sec of $$("[data-ig]")) {
  const tiles = $$(".ig-grid li", sec);
  let pending = tiles.length, shown = 0;
  sec.hidden = true;
  const done = () => { if (--pending === 0 && shown) { sec.hidden = false; reduce ? sec.classList.add("in") : io.observe(sec); } };
  for (const li of tiles) {
    const img = $("img", li);
    const ok = () => { shown++; done(); }, bad = () => { li.hidden = true; done(); };
    if (img.complete) (img.naturalWidth ? ok : bad)(); else { img.loading = "eager"; img.addEventListener("load", ok, { once: true }); img.addEventListener("error", bad, { once: true }); }
  }
}

/* ---------- Touch: first tap flips a resource card, second tap opens it ---------- */
if (matchMedia("(hover: none)").matches) {
  for (const li of $$(".flip-grid li")) {
    $("a", li).addEventListener("click", (e) => {
      if (!li.classList.contains("flipped")) { e.preventDefault(); $$(".flip-grid li.flipped").forEach((x) => x.classList.remove("flipped")); li.classList.add("flipped"); }
    });
  }
}
