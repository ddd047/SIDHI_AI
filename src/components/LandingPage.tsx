"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";
import ParticleCanvas from "./ParticleCanvas";
import Tagline from "./Tagline";

/* ─── Main landing page component ───────────────────────────── */
export default function LandingPage() {
  const logoRef = useRef<HTMLDivElement>(null);
  const [glowIntensity, setGlowIntensity] = useState(0);

  /* Initialise slim engine plugins */
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  /* Track cursor position relative to logo centre */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;

      const rect = logoRef.current.getBoundingClientRect();
      const logoCenterX = rect.left + rect.width / 2;
      const logoCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - logoCenterX;
      const dy = e.clientY - logoCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const ACTIVATION_RADIUS = 320;

      if (distance < ACTIVATION_RADIUS) {
        const intensity = 1 - distance / ACTIVATION_RADIUS;
        setGlowIntensity(intensity);
      } else {
        setGlowIntensity(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* Dynamic glow styles derived from intensity */
  const glowRadius = Math.round(glowIntensity * 80);
  const glowOpacity = glowIntensity;
  const scaleValue = 1 + glowIntensity * 0.05;

  const logoStyle: React.CSSProperties = {
    filter:
      glowIntensity > 0
        ? `drop-shadow(0 0 ${glowRadius}px rgba(139, 92, 246, ${glowOpacity})) drop-shadow(0 0 ${glowRadius * 2}px rgba(139, 92, 246, ${glowOpacity * 0.5}))`
        : "none",
    transform: `scale(${scaleValue})`,
    transition: "filter 0.15s ease-out, transform 0.15s ease-out",
  };

  return (
    <ParticlesProvider init={particlesInit}>
      <div className="relative h-[100dvh] w-full bg-gradient-to-br from-black via-neutral-950 to-purple-950 flex flex-col items-center justify-center overflow-hidden">
        {/* ── Particle background ─────────────────────────── */}
        <ParticleCanvas />

        {/* ── Logo — 30 % of the shortest viewport side ───── */}
        <div
          ref={logoRef}
          style={logoStyle}
          className="relative z-10 select-none pointer-events-none"
        >
          <Image
            src="/SidhiAI.svg"
            alt="SIDHI AI Logo"
            width={800}
            height={800}
            priority
            style={{
              width: "30vmin",
              height: "30vmin",
              filter: "brightness(10)",
            }}
          />
        </div>

        {/* ── Tagline — separate component ────────────────── */}
        <div className="relative z-10 mt-10 select-none pointer-events-none">
          <Tagline />
        </div>
      </div>
    </ParticlesProvider>
  );
}
