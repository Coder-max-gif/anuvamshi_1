"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { selectSet, type SequenceData, type SequenceSet } from "@/lib/sequence";
import { FrameEngine } from "./FrameEngine";

export type ScrollyCanvasHandle = {
  setProgress: (p: number) => void;
  setActive: (active: boolean) => void;
};

type Props = {
  data: SequenceData;
  className?: string;
  focalX?: number;
  focalY?: number;
  onReady?: () => void;
  onFailed?: () => void;
  onFrame?: (index: number, set: SequenceSet) => void;
};

/**
 * Reusable canvas that renders a frame sequence. It knows nothing about scrolling:
 * callers drive it with `setProgress(0..1)` through the imperative handle.
 */
export const ScrollyCanvas = forwardRef<ScrollyCanvasHandle, Props>(function ScrollyCanvas(
  { data, className, focalX = 0.5, focalY = 0.4, onReady, onFailed, onFrame },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FrameEngine | null>(null);
  const progressRef = useRef(0);
  const activeRef = useRef(true);
  const cbRef = useRef({ onReady, onFailed, onFrame });
  cbRef.current = { onReady, onFailed, onFrame };
  const [set, setSet] = useState<SequenceSet | null>(null);
  const [painted, setPainted] = useState(false);

  useImperativeHandle(ref, () => ({
    setProgress(p) {
      progressRef.current = p;
      engineRef.current?.setProgress(p);
    },
    setActive(a) {
      activeRef.current = a;
      engineRef.current?.setActive(a);
    },
  }));

  // Pick (and re-pick on orientation / breakpoint change) the right frame set.
  useEffect(() => {
    const pick = () => setSet((prev) => {
      const next = selectSet(data.sets);
      return prev?.id === next.id ? prev : next;
    });
    pick();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(pick, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, [data]);

  // Create the engine for the chosen set.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !set) return;
    setPainted(false); // keep the poster visible until the new set paints
    let engine: FrameEngine;
    try {
      engine = new FrameEngine(canvas, set, data.curve, {
        focalX,
        focalY,
        ahead: set.id === "desktop" ? 18 : 24,
        behind: set.id === "desktop" ? 6 : 8,
        maxDpr: set.id === "desktop" ? 2 : 1.5,
        onFirstPaint: () => {
          setPainted(true);
          cbRef.current.onReady?.();
        },
        onError: () => cbRef.current.onFailed?.(),
        onFrame: (i) => cbRef.current.onFrame?.(i, set),
      });
    } catch {
      cbRef.current.onFailed?.();
      return;
    }
    engineRef.current = engine;
    engine.start();
    engine.setProgress(progressRef.current);
    engine.setActive(activeRef.current);

    const ro = new ResizeObserver(() => engine.resize());
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, [set, data, focalX, focalY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${className ?? ""} transition-opacity duration-500 ${painted ? "opacity-100" : "opacity-0"}`}
    />
  );
});
