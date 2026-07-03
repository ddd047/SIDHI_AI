"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  glow: number;
  pulsePhase: number;
  hue: number;
  layer: number; // 0 = deep background, 1 = mid, 2 = foreground
}

interface Pulse {
  ax: number; ay: number;
  bx: number; by: number;
  t: number;
  speed: number;
  hue: number;
  alpha: number;
  width: number;
}

export default function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const dpr = window.devicePixelRatio || 1;
    let W = window.innerWidth;
    let H = window.innerHeight;

    function setSize() {
      canvas!.width  = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width  = W + "px";
      canvas!.style.height = H + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    setSize();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      setSize();
    };
    window.addEventListener("resize", onResize);

    /* ─── Node config ──────────────────────────────────────
       Three layers for depth: background (dim, slow),
       mid (medium), foreground (bright, fast).
    ─────────────────────────────────────────────────────── */
    const COUNTS    = [40, 55, 35];   // nodes per layer
    const MAX_DISTS = [220, 170, 130]; // connection threshold per layer
    const SPEEDS    = [0.18, 0.32, 0.52]; // velocity scale per layer
    const RADII     = [1.2, 2.0, 3.0];   // base radius per layer
    const ALPHAS    = [0.6, 0.85, 1.0];   // brightness per layer

    const REPEL_DIST = 200;

    const nodes: Node[] = [];

    COUNTS.forEach((count, layer) => {
      for (let i = 0; i < count; i++) {
        const r = RADII[layer] + Math.random() * RADII[layer] * 0.8;
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * SPEEDS[layer],
          vy: (Math.random() - 0.5) * SPEEDS[layer],
          radius: r, baseRadius: r,
          glow: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          hue: 255 + Math.random() * 60, // 255–315 indigo→violet→magenta
          layer,
        });
      }
    });

    const pulses: Pulse[] = [];

    /* ─── Mouse ─────────────────────────────────────────── */
    const onMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY, active: true }; };
    const onLeave = () => { mouseRef.current.active = false; };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    /* ─── Render loop ───────────────────────────────────── */
    let frame = 0;

    function tick() {
      rafRef.current = requestAnimationFrame(tick);
      frame++;

      const m = mouseRef.current;

      // Fully clear the canvas — gradient background shows through
      ctx.clearRect(0, 0, W, H);

      /* ── Update nodes ── */
      nodes.forEach((n, ni) => {
        n.pulsePhase += 0.02 + n.layer * 0.01;

        // Mouse repulsion
        if (m.active) {
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < REPEL_DIST && d > 0) {
            const f = ((REPEL_DIST - d) / REPEL_DIST);
            const strength = 0.8 + n.layer * 0.6;
            n.vx += (dx / d) * f * f * strength;
            n.vy += (dy / d) * f * f * strength;
            n.glow = Math.min(1, n.glow + f * 0.6);
          }
        }

        // Friction
        const friction = 0.97 - n.layer * 0.002;
        n.vx *= friction;
        n.vy *= friction;

        // Speed cap
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        const cap = 1.5 + n.layer * 1.2;
        if (spd > cap) { n.vx = (n.vx / spd) * cap; n.vy = (n.vy / spd) * cap; }

        n.x += n.vx;
        n.y += n.vy;

        // Soft wrap
        if (n.x < -40) n.x = W + 40;
        if (n.x > W + 40) n.x = -40;
        if (n.y < -40) n.y = H + 40;
        if (n.y > H + 40) n.y = -40;

        // Glow decay
        n.glow *= 0.93;

        // Spawn pulses staggered by frame
        if (frame % 6 === ni % 6 && Math.random() < 0.04) {
          const maxDist = MAX_DISTS[n.layer];
          let closest: Node | null = null;
          let closestD = maxDist;
          nodes.forEach((q) => {
            if (q === n || q.layer !== n.layer) return;
            const d = Math.hypot(q.x - n.x, q.y - n.y);
            if (d < closestD) { closestD = d; closest = q; }
          });
          if (closest) {
            pulses.push({
              ax: n.x, ay: n.y,
              bx: (closest as Node).x, by: (closest as Node).y,
              t: 0,
              speed: 0.014 + Math.random() * 0.024,
              hue: n.hue,
              alpha: ALPHAS[n.layer],
              width: 1 + n.layer * 0.8,
            });
          }
        }
      });

      /* ── Draw connections per layer (back to front) ── */
      for (let layer = 0; layer < 3; layer++) {
        const layerNodes = nodes.filter(n => n.layer === layer);
        const maxDist    = MAX_DISTS[layer];
        const baseAlpha  = ALPHAS[layer];

        for (let i = 0; i < layerNodes.length; i++) {
          for (let j = i + 1; j < layerNodes.length; j++) {
            const a = layerNodes[i];
            const b = layerNodes[j];
            const d = Math.hypot(b.x - a.x, b.y - a.y);
            if (d > maxDist) continue;

            const prox = 1 - d / maxDist;
            const glowBoost = ((a.glow + b.glow) * 0.5) * 0.5;
            const alpha = Math.min(0.98, prox * prox * baseAlpha * 1.1 + glowBoost);

            // Near-mouse boost
            let finalAlpha = alpha;
            if (m.active) {
              const da = Math.hypot(m.x - a.x, m.y - a.y);
              const db = Math.hypot(m.x - b.x, m.y - b.y);
              if (da < REPEL_DIST || db < REPEL_DIST) {
                finalAlpha = Math.min(0.98, alpha + 0.4);
              }
            }

            const hue = (a.hue + b.hue) / 2;
            const sat = 75 + layer * 8;
            const lum = 55 + layer * 12;

            ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${lum}%, ${finalAlpha})`;
            ctx.lineWidth   = 0.5 + prox * (0.8 + layer * 0.6);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* ── Mouse web lines ── */
      if (m.active) {
        nodes.forEach((n) => {
          const d = Math.hypot(m.x - n.x, m.y - n.y);
          if (d < REPEL_DIST + 40) {
            const t = 1 - d / (REPEL_DIST + 40);
            ctx.strokeStyle = `hsla(${n.hue}, 85%, 75%, ${t * 0.45})`;
            ctx.lineWidth   = 0.6 + n.layer * 0.2;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        });

        // Cursor aura
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 100);
        grad.addColorStop(0,   "rgba(167, 139, 250, 0.22)");
        grad.addColorStop(0.5, "rgba(139, 92, 246, 0.08)");
        grad.addColorStop(1,   "rgba(109, 40, 217, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 100, 0, Math.PI * 2);
        ctx.fill();

        // Bright cursor dot
        ctx.save();
        ctx.shadowColor = "rgba(196, 181, 253, 0.9)";
        ctx.shadowBlur  = 16;
        ctx.fillStyle   = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* ── Draw pulses ── */
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }

        const px = p.ax + (p.bx - p.ax) * p.t;
        const py = p.ay + (p.by - p.ay) * p.t;
        const fade = p.alpha * Math.sin(p.t * Math.PI); // rises and falls

        ctx.save();
        ctx.shadowColor = `hsl(${p.hue}, 90%, 75%)`;
        ctx.shadowBlur  = 14;
        ctx.fillStyle   = `hsla(${p.hue}, 95%, 82%, ${fade})`;
        ctx.beginPath();
        ctx.arc(px, py, 2 + p.width, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* ── Draw nodes (back to front) ── */
      nodes.forEach((n) => {
        const pulse = 0.7 + 0.3 * Math.sin(n.pulsePhase);
        const r     = n.baseRadius * (1 + n.glow * 1.8);
        const layerAlpha = ALPHAS[n.layer];
        const glowA = Math.min(1, layerAlpha * (0.7 + n.glow * 0.3) * pulse);

        // Outer glow ring
        ctx.save();
        ctx.shadowColor = `hsl(${n.hue}, 90%, 65%)`;
        ctx.shadowBlur  = 10 + n.layer * 8 + n.glow * 22;
        ctx.fillStyle   = `hsla(${n.hue}, 85%, 65%, ${glowA})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Bright white core
        const coreAlpha = 0.55 + n.layer * 0.2 + n.glow * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${coreAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.32, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
