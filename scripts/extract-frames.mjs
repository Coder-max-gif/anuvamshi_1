// Reproducible frame pipeline: node scripts/extract-frames.mjs
// Source video is never modified. Outputs WebP sequences + motion curve + manifest + stills + contact sheets.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const SRC = "public/source/founder-film.mp4";
const OUT = "public/sequence";
const probe = JSON.parse(execFileSync("ffprobe", ["-v","error","-select_streams","v:0","-show_entries","stream=width,height,r_frame_rate,duration,nb_frames,codec_name","-of","json",SRC]).toString()).streams[0];
const [n,d] = probe.r_frame_rate.split("/").map(Number); const fps = n/d;
const total = Number(probe.nb_frames);

// The source carries a generator badge (sparkle, ~72px, fixed at 1740,900 in every frame).
// delogo interpolates that box from its surrounding pixels; applied FIRST so every derivative is clean.
const CLEAN = "delogo=x=1694:y=854:w=92:h=92";
// Mild sharpening only (recovers detail softened by H.264 + WebP). No upscaling, no generative changes.
const SHARPEN = "unsharp=5:5:0.45:3:3:0.0";

// desktop:  every source frame at native 1920×1080 (never upscaled), high quality.
// mobile:   every 2nd frame @1280w — small landscape screens / low-power fallback.
// portrait: every source frame, centre 2:3 crop at native 1080 height — phones in portrait.
//           The subject stays within the centre third for the whole shot (see docs/contact-sheet-portrait.jpg).
const sets = [
  { id:"desktop",  width:1920, step:1, q:84 },
  { id:"mobile",   width:1280, step:2, q:80 },
  { id:"portrait", width:720,  step:1, q:84, crop:{ w:720, h:1080 } },
];

// ---- Motion curve -------------------------------------------------------------------------
// Mean luma difference between consecutive frames. Scroll distance is then allotted in proportion
// to visible motion (with a floor), so near-static stretches don't feel "stuck" while scrolling.
const raw = execFileSync("ffmpeg",["-v","error","-i",SRC,"-vf","scale=320:-1,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-","-f","null","-"]).toString();
const diffs = [...raw.matchAll(/YAVG=([\d.]+)/g)].map(m=>Number(m[1]));
const mean = diffs.reduce((a,b)=>a+b,0)/diffs.length;
const FLOOR = 0.55 * mean;                       // static moments still advance, just faster
const weights = diffs.map(v => Math.max(v, FLOOR));
const cum = [0]; for (const w of weights) cum.push(cum[cum.length-1] + w);
const curve = cum.map(v => +(v / cum[cum.length-1]).toFixed(5)); // curve[f] = scroll progress at source frame f
while (curve.length < total) curve.push(1);
console.log(`motion curve: ${curve.length} points, mean diff ${mean.toFixed(2)}; 50% scroll reaches ${(curve.findIndex(c=>c>=0.5)/fps).toFixed(2)}s`);

const manifest = { source:{ path:SRC, ...probe, fps }, curve, sets:{} };
for (const s of sets) rmSync(path.join(OUT,s.id),{recursive:true,force:true}); // keep posters
for (const s of sets) {
  const dir = path.join(OUT,s.id); mkdirSync(dir,{recursive:true});
  const geo = s.crop ? `crop=${s.crop.w}:${s.crop.h}:(iw-${s.crop.w})/2:0` : (s.width === probe.width ? "null" : `scale=${s.width}:-2:flags=lanczos`);
  const vf = `${CLEAN},select='not(mod(n\\,${s.step}))',${geo},${SHARPEN}`;
  execFileSync("ffmpeg",["-v","error","-i",SRC,"-vf",vf,"-fps_mode","vfr","-c:v","libwebp","-quality",String(s.q),"-compression_level","6","-preset","photo",path.join(dir,"f%04d.webp")]);
  const files = readdirSync(dir).filter(f=>f.endsWith(".webp")).sort();
  const bytes = files.reduce((a,f)=>a+statSync(path.join(dir,f)).size,0);
  const h = s.crop ? s.crop.h : Math.round(s.width*probe.height/probe.width/2)*2;
  manifest.sets[s.id] = { width:s.width, height:h, count:files.length, step:s.step, bytes,
    ramMB: +(files.length*s.width*h*4/1048576).toFixed(0) };
  console.log(s.id, files.length,"frames", (bytes/1048576).toFixed(1),"MB on disk; fully-decoded RAM would be", manifest.sets[s.id].ramMB,"MB (so we use a sliding window)");
}
writeFileSync(path.join(OUT,"manifest.json"), JSON.stringify(manifest));

mkdirSync("docs",{recursive:true});
execFileSync("ffmpeg",["-v","error","-y","-i",SRC,"-vf",`${CLEAN},fps=2,scale=320:-1,tile=5x4`,"-frames:v","1","docs/contact-sheet.jpg"]);
execFileSync("ffmpeg",["-v","error","-y","-i",SRC,"-vf","fps=2,crop=720:1080:(iw-720)/2:0,scale=160:-1,tile=10x2","-frames:v","1","docs/contact-sheet-portrait.jpg"]);
// posters: exact first frame (no flash when the canvas takes over)
execFileSync("ffmpeg",["-v","error","-y","-i",SRC,"-vframes","1","-vf",`${CLEAN},${SHARPEN}`,"-q:v","3","public/sequence/poster.jpg"]);
execFileSync("ffmpeg",["-v","error","-y","-i",SRC,"-vframes","1","-vf",`crop=720:1080:(iw-720)/2:0,${SHARPEN}`,"-q:v","3","public/sequence/poster-portrait.jpg"]);
// stills: one per act of the film (studio, turn, dusk close-up)
mkdirSync("public/stills",{recursive:true});
for (const [name,t] of [["studio",1.2],["turn",3.0],["dusk",5.6],["closeup",9.6]]) {
  execFileSync("ffmpeg",["-v","error","-y","-ss",String(t),"-i",SRC,"-frames:v","1","-vf",`${CLEAN},${SHARPEN}`,"-c:v","libwebp","-quality","86",`public/stills/${name}.webp`]);
  execFileSync("ffmpeg",["-v","error","-y","-ss",String(t),"-i",SRC,"-frames:v","1","-vf",`crop=720:1080:(iw-720)/2:0,${SHARPEN}`,"-c:v","libwebp","-quality","86",`public/stills/${name}-portrait.webp`]);
}
// reel: 14 frames evenly across the film, used by the 3D film reel and the service cards
rmSync("public/reel",{recursive:true,force:true}); mkdirSync("public/reel",{recursive:true});
const REEL = 14;
for (let i = 0; i < REEL; i++) {
  const t = (i / (REEL - 1)) * (Number(probe.duration) - 0.1);
  execFileSync("ffmpeg",["-v","error","-y","-ss",t.toFixed(3),"-i",SRC,"-frames:v","1","-vf",`${CLEAN},scale=800:-2:flags=lanczos,${SHARPEN}`,"-c:v","libwebp","-quality","82",`public/reel/r${String(i+1).padStart(2,"0")}.webp`]);
}
execFileSync("ffmpeg",["-v","error","-y","-ss","9.6","-i",SRC,"-frames:v","1","-vf",`${CLEAN},scale=1200:-2`,"-q:v","4","public/og.jpg"]);
// ---- Photographs supplied by the client (originals in the project root stay untouched) ----
mkdirSync("public/photos",{recursive:true});
for (const [src,name,extra] of [
  ["i am founder.jpeg","stage",""],
  ["self-growth.jpeg","portrait-warm",""],
  ["short hair -.jpeg","portrait-desk","crop=iw:ih-8:0:0,"],   // trims a thin black bar at the bottom edge
]) {
  execFileSync("ffmpeg",["-v","error","-y","-i",src,"-vf",`${extra}unsharp=3:3:0.3`,"-c:v","libwebp","-quality","88",`public/photos/${name}.webp`]);
}
console.log("done");
