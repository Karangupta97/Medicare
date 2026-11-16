"use client";

import { useEffect, useRef } from "react";

const RADIUS = 180;
const STEP = 6; // px between particles
const PUSH_RADIUS = 120;
const DISPERSION = 9;
const RETURN = 0.08;

interface Dot {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

/**
 * Color reveal that follows the mouse, in the style of the footer's particle wordmark. The overlay is grayscale plus a
 * navy tint with a soft circular hole at the cursor (the grayscale comes from backdrop-filter, so it stays aligned with
 * the parallax image). Inside the hole, dots sampled from the photo's real colors are pushed away from the cursor and
 * spring back. It listens on the closest `.cursor-reveal-root` ancestor, so the caption card doesn't block it.
 */
export function CursorReveal({ src }: { src: string }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const root = overlay?.closest<HTMLElement>(".cursor-reveal-root");
    const ctx = canvas?.getContext("2d");
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!overlay || !canvas || !root || !ctx || !ring || !dot) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pos = { x: 0, y: 0, r: 0 };
    const target = { x: 0, y: 0, r: 0 };
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let cancelled = false;
    let img: HTMLImageElement | null = null;

    const build = () => {
      if (!img || w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Sample the photo at 1 CSS px per pixel, cropped like object-cover object-center.
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      octx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      const data = octx.getImageData(0, 0, w, h).data;
      dots = [];
      for (let y = STEP / 2; y < h; y += STEP) {
        for (let x = STEP / 2; x < w; x += STEP) {
          const i = (Math.floor(y) * w + Math.floor(x)) * 4;
          dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})` });
        }
      }
    };

    const tick = (time: number) => {
      const step = Math.min((time - last) / 16.667 || 1, 3);
      last = time;
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      pos.r += (target.r - pos.r) * 0.12;
      overlay.style.setProperty("--x", `${pos.x}px`);
      overlay.style.setProperty("--y", `${pos.y}px`);
      overlay.style.setProperty("--r", `${pos.r}px`);
      // Custom cursor: the ring trails the pointer and grows in; the dot (see moveDot) stays exactly on it.
      const k = Math.min(pos.r / RADIUS, 1);
      ring.style.opacity = `${k}`;
      ring.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${0.4 + 0.6 * k})`;

      ctx.clearRect(0, 0, w, h);
      let moving = false;
      const friction = Math.pow(0.85, step);
      for (const d of dots) {
        const near = Math.hypot(d.ox - pos.x, d.oy - pos.y);
        const displaced = Math.abs(d.x - d.ox) + Math.abs(d.y - d.oy) > 0.1 || Math.abs(d.vx) + Math.abs(d.vy) > 0.02;
        if (near > pos.r + PUSH_RADIUS && !displaced) continue;
        const dx = pos.x - d.x;
        const dy = pos.y - d.y;
        const dist = Math.hypot(dx, dy);
        if (!reduced && pos.r > 1 && dist > 0 && dist < PUSH_RADIUS) {
          const force = (PUSH_RADIUS - dist) / PUSH_RADIUS;
          d.vx -= (dx / dist) * force * DISPERSION * step;
          d.vy -= (dy / dist) * force * DISPERSION * step;
        }
        d.vx += (d.ox - d.x) * RETURN * step;
        d.vy += (d.oy - d.y) * RETURN * step;
        d.vx *= friction;
        d.vy *= friction;
        d.x += d.vx * step;
        d.y += d.vy * step;
        if (displaced) moving = true;
        const alpha = Math.max(0, Math.min(1, (1 - near / Math.max(pos.r, 1)) * 2));
        if (alpha <= 0.02) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const settled = !moving && Math.abs(target.x - pos.x) < 0.5 && Math.abs(target.y - pos.y) < 0.5 && Math.abs(target.r - pos.r) < 0.5;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const run = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const setTarget = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      dot.style.opacity = "1";
      dot.style.transform = `translate(${target.x}px, ${target.y}px) translate(-50%, -50%)`;
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setTarget(e);
      root.style.cursor = "none";
      pos.x = target.x;
      pos.y = target.y;
      target.r = RADIUS;
      run();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setTarget(e);
      run();
    };
    const onLeave = () => {
      root.style.cursor = "";
      dot.style.opacity = "0";
      target.r = 0;
      run();
    };

    const resize = () => {
      w = Math.round(root.clientWidth);
      h = Math.round(root.clientHeight);
      build();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      img = image;
      resize();
    };
    image.src = src;

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelled = true;
      observer.disconnect();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      root.style.cursor = "";
    };
  }, [src]);

  const mask = "radial-gradient(circle var(--r, 0px) at var(--x, 50%) var(--y, 50%), transparent 0%, transparent 55%, #000 100%)";
  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-hero-via/70 backdrop-grayscale backdrop-contrast-110"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 size-14 rounded-full border border-on-hero/60 bg-on-hero/5 opacity-0 shadow-[0_0_24px_rgb(255_255_255/0.15)] backdrop-blur-[2px] will-change-transform"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 size-1.5 rounded-full bg-hero-accent-to opacity-0 transition-opacity duration-200 will-change-transform"
      />
    </>
  );
}
