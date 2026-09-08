"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent, TouchEvent } from "react";

interface InkRevealProps {
  /** RGB color of the mask overlay, e.g. [252, 250, 248] */
  maskColor?: [number, number, number];
  /** Optional image painted into the brush stamps instead of the mask */
  imageSrc?: string;
  /** Radius of each ink stamp in px */
  brushSize?: number;
  /** How long each stamp lives before fading (ms) */
  lifetime?: number;
  /** Initial radius before the stamp expands */
  rStart?: number;
  /** Random variation factor for stamp radius (0–1) */
  rVary?: number;
  /** Min pixel distance between stamps along a stroke */
  stampStep?: number;
  /** Max stamps alive at once (oldest are pruned) */
  maxStamps?: number;
  /** Number of segments on the wobble circle (higher = smoother) */
  segments?: number;
  /** Wobble amplitude weights [primary, secondary, tertiary] */
  wobble?: [number, number, number];
  /** Gradient inner-radius factor (0–1, relative to stamp radius) */
  gradientInnerRadius?: number;
  /** Gradient opacity stops [center, mid, edge] */
  gradientStops?: [number, number, number];
  /** Extra CSS class for the canvas element */
  className?: string;
  /** Extra inline styles for the canvas element */
  style?: CSSProperties;
}

interface Stamp {
  x: number;
  y: number;
  born: number;
  seed: number;
  rmax: number;
}

export default function InkReveal({
  maskColor = [252, 250, 248],
  imageSrc,
  brushSize = 128,
  lifetime = 600,
  rStart = 10,
  rVary = 0.45,
  stampStep = 10,
  maxStamps = 200,
  segments = 36,
  wobble = [0.14, 0.08, 0.05],
  gradientInnerRadius = 0.2,
  gradientStops = [0.95, 0.88, 0],
  className,
  style,
}: InkRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const stampsRef = useRef<Stamp[]>([]);
  const runningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const loopRef = useRef<() => void>(() => undefined);

  const mc = maskColor;

  const traceStamp = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      seed: number,
    ) => {
      ctx.beginPath();
      for (let i = 0; i <= segments; i += 1) {
        const angle = (i / segments) * Math.PI * 2;
        const wob =
          0.78 +
          wobble[0] * Math.sin(angle * 3 + seed) +
          wobble[1] * Math.sin(angle * 5 + seed * 2.1) +
          wobble[2] * Math.sin(angle * 7 + seed * 0.7);
        const px = x + Math.cos(angle) * r * wob;
        const py = y + Math.sin(angle) * r * wob;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
    },
    [segments, wobble],
  );

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    dimsRef.current = { w, h };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    if (imageSrc) {
      ctx.clearRect(0, 0, w, h);
    } else {
      ctx.fillStyle = `rgb(${mc[0]},${mc[1]},${mc[2]})`;
      ctx.fillRect(0, 0, w, h);
    }
  }, [imageSrc, mc]);

  const drawImageCover = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const image = imageRef.current;
      const { w, h } = dimsRef.current;
      if (!image?.naturalWidth || !w || !h) return;

      const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      ctx.drawImage(image, (w - width) / 2, (h - height) / 2, width, height);
    },
    [],
  );

  const carveInk = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      seed: number,
      alpha: number,
    ) => {
      const g = ctx.createRadialGradient(
        x,
        y,
        r * gradientInnerRadius,
        x,
        y,
        r,
      );
      g.addColorStop(0, `rgba(0,0,0,${gradientStops[0] * alpha})`);
      g.addColorStop(0.5, `rgba(0,0,0,${gradientStops[1] * alpha})`);
      g.addColorStop(1, `rgba(0,0,0,${gradientStops[2] * alpha})`);
      ctx.fillStyle = g;
      traceStamp(ctx, x, y, r, seed);
      ctx.fill();
    },
    [gradientInnerRadius, gradientStops, traceStamp],
  );

  const paintImageStamp = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      seed: number,
      alpha: number,
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      traceStamp(ctx, x, y, r, seed);
      ctx.clip();
      drawImageCover(ctx);
      ctx.restore();
    },
    [drawImageCover, traceStamp],
  );

  const addStamp = useCallback(
    (x: number, y: number) => {
      const stamps = stampsRef.current;
      if (stamps.length >= maxStamps) stamps.shift();
      stamps.push({
        x,
        y,
        born: performance.now(),
        seed: Math.random() * Math.PI * 2,
        rmax: brushSize * (1 - rVary + Math.random() * rVary),
      });
    },
    [brushSize, maxStamps, rVary],
  );

  const stampAlong = useCallback(
    (x: number, y: number) => {
      const last = lastPosRef.current;
      if (!last) {
        addStamp(x, y);
      } else {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(dist / stampStep));
        for (let i = 1; i <= steps; i += 1) {
          addStamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
        }
      }
      lastPosRef.current = { x, y };
    },
    [addStamp, stampStep],
  );

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = dimsRef.current;
    const now = performance.now();
    const stamps = stampsRef.current;

    ctx.globalCompositeOperation = "source-over";
    if (imageSrc) {
      ctx.clearRect(0, 0, w, h);
    } else {
      ctx.fillStyle = `rgb(${mc[0]},${mc[1]},${mc[2]})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "destination-out";
    }

    for (let i = stamps.length - 1; i >= 0; i -= 1) {
      const stamp = stamps[i];
      const t = (now - stamp.born) / lifetime;
      if (t >= 1) {
        stamps.splice(i, 1);
        continue;
      }
      const ease = 1 - Math.pow(1 - t, 3);
      const r = rStart + (stamp.rmax - rStart) * ease;
      const alpha = 1 - t * t;
      if (imageSrc) {
        paintImageStamp(ctx, stamp.x, stamp.y, r, stamp.seed, alpha);
      } else {
        carveInk(ctx, stamp.x, stamp.y, r, stamp.seed, alpha);
      }
    }

    if (stamps.length) {
      requestAnimationFrame(() => loopRef.current());
    } else {
      runningRef.current = false;
    }
  }, [carveInk, imageSrc, lifetime, mc, paintImageStamp, rStart]);

  const startLoop = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      requestAnimationFrame(() => loopRef.current());
    }
  }, []);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    if (!imageSrc) return;

    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      imageRef.current = image;
      resize();
      if (stampsRef.current.length) startLoop();
    };
    image.src = imageSrc;

    return () => {
      image.onload = null;
      image.src = "";
      imageRef.current = null;
    };
  }, [imageSrc, resize, startLoop]);

  const getRelativePos = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const getRelativeTouchPos = (event: TouchEvent<HTMLCanvasElement>) => {
    if (!event.touches.length) return null;
    const rect = event.currentTarget.getBoundingClientRect();
    const touch = event.touches[0];
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        cursor: "none",
        touchAction: "pan-y",
        ...style,
      }}
      onMouseEnter={(event) => {
        const pos = getRelativePos(event);
        lastPosRef.current = pos;
        stampAlong(pos.x, pos.y);
        startLoop();
      }}
      onMouseMove={(event) => {
        const pos = getRelativePos(event);
        stampAlong(pos.x, pos.y);
        startLoop();
      }}
      onMouseLeave={() => {
        lastPosRef.current = null;
      }}
      onTouchStart={(event) => {
        const pos = getRelativeTouchPos(event);
        if (pos) {
          lastPosRef.current = pos;
          stampAlong(pos.x, pos.y);
          startLoop();
        }
      }}
      onTouchMove={(event) => {
        const pos = getRelativeTouchPos(event);
        if (pos) {
          stampAlong(pos.x, pos.y);
          startLoop();
        }
      }}
      onTouchEnd={() => {
        lastPosRef.current = null;
      }}
    />
  );
}
