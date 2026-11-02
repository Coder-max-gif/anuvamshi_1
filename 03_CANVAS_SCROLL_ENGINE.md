# PROMPT 03 — BUILD THE VIDEO-DERIVED CANVAS SCROLL ENGINE

Read the master prompt and reuse the extracted frame manifest.

Build a reusable TypeScript component named ScrollyCanvas.

Requirements:
- HTML Canvas, not a video tag, for the scroll-scrubbed sequence.
- Sticky viewport canvas within a long scroll container.
- Map scroll progress to frame index.
- Smooth forward and reverse scrubbing.
- Progressive image loading and decoding.
- Load the poster and first frames with priority.
- Avoid white/blank flashes; keep the last valid frame visible while the next frame loads.
- Cover-crop correctly across desktop/mobile aspect ratios.
- Resize observer or equivalent resize handling.
- Cap devicePixelRatio.
- Avoid holding every original 4K frame in memory simultaneously; use an explicit memory-conscious strategy.
- Support reduced motion and low-powered devices with a static/less intensive fallback.
- Handle missing frames safely.
- Clean up observers, listeners and animation loops.
- Keep the sequence and overlay independently reusable.

Do not change the source footage or replace it with a different visual. Test slow scroll, fast scroll, reverse scroll, resizing and mobile.
