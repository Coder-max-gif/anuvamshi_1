# PROMPT 02 — AUDIT MY VIDEO AND CREATE THE FRAME SEQUENCE

Read the master prompt first.

Inspect the existing project and find my original video. Do not start a new design.

1. Report the exact video path, duration, resolution, aspect ratio, frame rate and codec.
2. Inspect its motion and identify the most useful continuous segment(s) for a scroll story.
3. Check whether the footage is truly 4K. Never upscale and describe it as native 4K.
4. Create an FFmpeg extraction script that can be rerun.
5. Extract chronological frames from the actual footage. Choose a sensible frame rate based on the movement and duration; avoid unnecessary duplicate frames.
6. Generate optimized WebP/AVIF derivatives at source-supported dimensions, plus mobile variants.
7. Create a JSON manifest with frame number, path, dimensions and timing.
8. Create a contact sheet to review the extracted sequence.
9. Preserve the original source video untouched.
10. Estimate total asset size and memory requirements.

Do not generate replacement images, use stock imagery or change the subject/background. Stop after the audit and extraction, then report the outputs and any decisions requiring approval.
