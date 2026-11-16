"use client";

/*
 * Cursor Driven Particle Typography, from Componentry (https://componentry.dev/docs/components/cursor-driven-particle-typography),
 * installed with `npx shadcn@latest add @componentry/cursor-driven-particle-typography`. The registry file has no license
 * header; the docs list Componentry components as MIT and say to verify licenses before production use.
 * Props kept: className, text, fontSize, fontFamily, particleSize, particleDensity, dispersionStrength, returnSpeed, color.
 * Added: `fontWeight`, `maxFontRatio`, `heartForI` (largest text width as a share of the container width), `decorative`.
 * Changes: the pointer is tracked on the window (the canvas can sit under or over other content and ignore pointer events);
 * devicePixelRatio capped at 2; waits for fonts; the loop stops once the particles have settled and restarts on pointer
 * movement; paused off screen and in hidden tabs; one static frame under prefers-reduced-motion; canvas is aria-hidden;
 * no touch listeners (the page keeps scrolling).
 * Cross-browser consistency: the particle grid is sampled from an offscreen canvas at 1 CSS pixel per pixel (so the dot spacing no
 * longer depends on devicePixelRatio or browser zoom), text is positioned with an alphabetic baseline and measured ascent and
 * descent (textBaseline "middle" differs between browsers), and the physics is scaled by the frame time (the motion is the same
 * on 60 Hz and 120 Hz screens).
 */

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface CursorDrivenParticleTypographyProps {
  className?: string;
  /** The text to render. */
  text: string;
  /** Largest font size in pixels. */
  fontSize?: number;
  fontFamily?: string;
  /** CSS font weight keyword or number. Default "bold"; use "normal" for fonts with a single weight. */
  fontWeight?: string;
  /** Radius of each particle. */
  particleSize?: number;
  /** Pixel step between particles (lower means more particles, minimum 1). */
  particleDensity?: number;
  /** How strongly the cursor pushes particles away. */
  dispersionStrength?: number;
  /** Speed at which particles return to their origin. */
  returnSpeed?: number;
  /** Particle color. Defaults to the container's computed text color. */
  color?: string;
  /** Largest text width as a share of the container width. */
  maxFontRatio?: number;
  /** Replace the dot of the first lowercase "i" with a heart (the glyph is drawn dotless, then a heart sits above its stem). */
  heartForI?: boolean;
}

const INTERACTION_RADIUS = 120;

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;

  constructor(
    readonly originX: number,
    readonly originY: number,
    private readonly size: number,
    private readonly color: string,
    private readonly dispersion: number,
    private readonly returnSpd: number,
  ) {
    this.x = originX + (Math.random() - 0.5) * 10;
    this.y = originY + (Math.random() - 0.5) * 10;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
  }

  /** `step` is the elapsed time in 60 Hz frames (1 at 60 fps, 0.5 at 120 fps). */
  update(mouseX: number, mouseY: number, pointerActive: boolean, step: number): void {
    if (pointerActive) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 0 && distance < INTERACTION_RADIUS) {
        const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
        this.vx -= (dx / distance) * force * this.dispersion * step;
        this.vy -= (dy / distance) * force * this.dispersion * step;
      }
    }
    this.vx += (this.originX - this.x) * this.returnSpd * step;
    this.vy += (this.originY - this.y) * this.returnSpd * step;
    const friction = Math.pow(0.85, step);
    this.vx *= friction;
    this.vy *= friction;
    this.x += this.vx * step;
    this.y += this.vy * step;
  }

  /** True while the particle is still visibly moving or displaced. */
  isMoving(): boolean {
    return Math.abs(this.vx) + Math.abs(this.vy) > 0.02 || Math.abs(this.x - this.originX) + Math.abs(this.y - this.originY) > 0.1;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function CursorDrivenParticleTypography({
  className,
  text,
  fontSize = 120,
  fontFamily = "Satoshi, sans-serif",
  fontWeight = "bold",
  particleSize = 1.5,
  particleDensity = 6,
  dispersionStrength = 15,
  returnSpeed = 0.08,
  color,
  maxFontRatio = 0.15,
  heartForI = false,
}: CursorDrivenParticleTypographyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas === null || container === null) return;
    const ctx = canvas.getContext("2d");
    if (ctx === null) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    let frame = 0;
    let running = false;
    let lastTime = 0;
    let visible = true;
    let mouseX = -1000;
    let mouseY = -1000;
    let pointerActive = false;
    let width = 0;
    let height = 0;
    let cancelled = false;

    const drawAll = () => {
      ctx.clearRect(0, 0, width, height);
      for (const particle of particles) particle.draw(ctx);
    };

    const tick = (time: number) => {
      frame = 0;
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      const step = lastTime === 0 ? 1 : Math.min(2, (time - lastTime) / (1000 / 60));
      lastTime = time;
      ctx.clearRect(0, 0, width, height);
      let moving = false;
      for (const particle of particles) {
        particle.update(mouseX, mouseY, pointerActive, step);
        particle.draw(ctx);
        if (!moving && particle.isMoving()) moving = true;
      }
      if (moving || pointerActive) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
        lastTime = 0;
      }
    };

    const start = () => {
      if (running || reducedMotion || !visible) return;
      running = true;
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    };

    const init = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particleColor = color ?? window.getComputedStyle(container).color;

      // Sample the text on an offscreen canvas at 1 CSS pixel per pixel: the dot grid is then the same on every screen density and zoom.
      const sample = document.createElement("canvas");
      sample.width = Math.max(1, Math.ceil(width));
      sample.height = Math.max(1, Math.ceil(height));
      const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
      if (sampleCtx === null) return;
      const effectiveFontSize = Math.min(fontSize, width * maxFontRatio);
      sampleCtx.fillStyle = "#000";
      sampleCtx.font = `${fontWeight} ${effectiveFontSize}px ${fontFamily}`;
      sampleCtx.textAlign = "center";
      // An alphabetic baseline placed from the measured ascent and descent: textBaseline "middle" is not the same in every browser.
      sampleCtx.textBaseline = "alphabetic";
      const iIndex = heartForI ? text.indexOf("i") : -1;
      const drawn = iIndex < 0 ? text : `${text.slice(0, iIndex)}\u0131${text.slice(iIndex + 1)}`;
      const metrics = sampleCtx.measureText(drawn);
      const baseline = height / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
      sampleCtx.fillText(drawn, width / 2, baseline);
      if (iIndex >= 0) {
        // The dot of the "i" is a heart, drawn above the dotless stem.
        const before = sampleCtx.measureText(text.slice(0, iIndex)).width;
        const stem = sampleCtx.measureText("\u0131");
        const stemCenterX = width / 2 - metrics.width / 2 + before + stem.width / 2;
        const stemTop = baseline - stem.actualBoundingBoxAscent;
        const stemWidth = stem.actualBoundingBoxLeft + stem.actualBoundingBoxRight;
        const heartWidth = stemWidth * 1.6;
        const heartHeight = heartWidth * 0.9;
        const cx = stemCenterX;
        const cy = stemTop - stemWidth * 0.3 - heartHeight / 2;
        sampleCtx.beginPath();
        sampleCtx.moveTo(cx, cy + heartHeight * 0.5);
        sampleCtx.bezierCurveTo(cx - heartWidth * 0.62, cy + heartHeight * 0.05, cx - heartWidth * 0.5, cy - heartHeight * 0.55, cx, cy - heartHeight * 0.2);
        sampleCtx.bezierCurveTo(cx + heartWidth * 0.5, cy - heartHeight * 0.55, cx + heartWidth * 0.62, cy + heartHeight * 0.05, cx, cy + heartHeight * 0.5);
        sampleCtx.closePath();
        sampleCtx.fill();
      }

      const pixels = sampleCtx.getImageData(0, 0, sample.width, sample.height);
      const step = Math.max(1, Math.round(particleDensity));
      const next: Particle[] = [];
      for (let y = 0; y < pixels.height; y += step) {
        for (let x = 0; x < pixels.width; x += step) {
          const alpha = pixels.data[(y * pixels.width + x) * 4 + 3] ?? 0;
          if (alpha > 128) {
            next.push(new Particle(x, y, particleSize, particleColor, dispersionStrength, returnSpeed));
          }
        }
      }
      particles = next;
      if (reducedMotion) {
        for (const particle of particles) {
          particle.x = particle.originX;
          particle.y = particle.originY;
        }
        drawAll();
      } else {
        start();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
      pointerActive =
        mouseX > -INTERACTION_RADIUS && mouseX < rect.width + INTERACTION_RADIUS && mouseY > -INTERACTION_RADIUS && mouseY < rect.height + INTERACTION_RADIUS;
      if (pointerActive) start();
    };
    const onPointerLeave = () => {
      pointerActive = false;
      mouseX = -1000;
      mouseY = -1000;
    };
    const onVisibility = () => {
      if (!document.hidden) start();
    };

    // A font used only on a canvas is never requested by the page, so ask for it explicitly before drawing.
    const fonts = document.fonts;
    const fontLoad = fonts === undefined ? Promise.resolve() : fonts.load(`${fontWeight} 100px ${fontFamily}`, text).then(() => fonts.ready);
    void fontLoad.catch(() => undefined).then(() => {
      if (!cancelled) init();
    });

    const resizeObserver = new ResizeObserver(() => init());
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) start();
    });
    intersectionObserver.observe(container);
    // Re-read the color when the theme class on <html> changes
    const themeObserver = new MutationObserver(() => init());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    if (!reducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      if (frame !== 0) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [text, fontSize, fontFamily, fontWeight, particleSize, particleDensity, dispersionStrength, returnSpeed, color, maxFontRatio, heartForI]);

  return (
    <div ref={containerRef} aria-hidden="true" className={cn("relative flex h-full min-h-[200px] w-full items-center justify-center", className)}>
      <canvas ref={canvasRef} className="pointer-events-none block h-full w-full" />
    </div>
  );
}
