import { isLowPower } from "./sequence";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canUseWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** The optional WebGL film finish runs only on capable, fine-pointer, motion-tolerant devices. */
export function shouldEnhance(): boolean {
  if (typeof window === "undefined") return false;
  return !prefersReducedMotion() && !isLowPower() && window.matchMedia("(pointer: fine)").matches && canUseWebGL();
}
