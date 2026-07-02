"use client";

import Particles from "@tsparticles/react";
import { useParticlesProvider } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";

/* ─── tsParticles configuration ─────────────────────────────── */
const particlesOptions: ISourceOptions = {
  fullScreen: { enable: false },
  fpsLimit: 120,
  particles: {
    color: { value: "#ffffff" },
    number: {
      value: 120,
      density: { enable: true, width: 1920, height: 1080 },
    },
    opacity: {
      value: 0.15,
    },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 2.5 } },
    move: {
      enable: true,
      speed: 0.3,
      direction: "none",
      outModes: { default: "bounce" },
    },
    links: {
      enable: false,
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      repulse: {
        distance: 150,
        duration: 0.4,
        speed: 0.5,
      },
    },
  },
  detectRetina: true,
};

export default function ParticleCanvas() {
  const { loaded } = useParticlesProvider();

  if (!loaded) return null;

  return (
    <Particles
      id="tsparticles"
      options={particlesOptions}
      className="absolute inset-0 z-0"
    />
  );
}
