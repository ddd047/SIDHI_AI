Technical Specification Script for Antigravity: Phase 2 Rollout
Hi Antigravity,

We are expanding the development phase of the interactive single-page application. Based on the initial boilerplate, we are implementing a multi-section structure featuring complex scroll-linked transitions and dynamic product sandboxes. Please implement the following features into our Next.js + Tailwind CSS codebase.

Key Milestones & Features to Implement:
1. Interactive Core Background & Canvas particles

    Continue using a hardware-accelerated particle system (custom canvas or configured tsParticles).

    Particles must be low-opacity neon purple, evenly distributed across the background viewport, and actively repelled when the mouse cursor enters their threshold coordinates.

2. Scroll-Linked Revolving Branding Mark (The Hero Transition)Initial State:
     The logo is centered on page load, rendered at a prominent size (scale(1)).
     Scroll Linkage: When scrolling from scrollY = 0 to roughly scrollY = 600 (transitioning from the landing gate into Section 2), the logo must dynamically:Rotate (revolve) up to 360 degree smoothly.Scale down to a compact state (approximately scale(0.45)).Translate upwards/translate off dynamically to exit focus seamlessly as the text moves in.
     Keep the proximity-based glow active: whenever the cursor moves close to the logo container, a rich, responsive CSS shadow/glow effect scales on its background.

3. Section 2: Product Portfolios (With Active Interactive Widgets)

    Project A: NCR-BHK

        Summary: A next-generation smart rental portal where users can search PGs/apartments, list space, and match with clean roommates.

        Visual Showcase Requirement: Build a simulated Tinder Swipe game card. Users must be able to click or drag "Like" (Swipe Right) or "Pass" (Swipe Left) on mock flatmate/PG profiles. Show instantaneous matching/swipe feedback states.
    Project B: NOVA

    Summary: An enterprise-grade, multi-agent AI framework helping bidding OEM/vendors read, audit, and estimate GAIL, SAIL, and BHEL RFPs for compliance and automatic bid proposal exports.

    Visual Showcase Requirement: Build a stylized interactive terminal shell depicting agent logs running automated reasoning loops. Show logs updating in chronological order when the user triggers a "Run Bid Analysis" action.

4. Section 3: Founder Team Grids

    Render cards for the Founders of SIDHI AI:

        Card 1: Founder & Lead Engineer

        Card 2: Co-Founder & Product Head

    Implement a holographic glow background card cover with contact paths including LinkedIn, GitHub, and a mailto anchor.

5. Section 4: Global Footer Assets

    Display structural footer details detailing copyright information for SIDHI AI.

    Promote the official primary domain linking to sidhiai.in.

    Add essential secondary navigational links.

Technical Specification & Integration Brief: Phase 3 Rollout

1. Global Aesthetic & Deep Royal Violet Theme

We are standardizing our branding components and interactive features across the platform to align with a Deep Royal Violet profile. Please apply these visual and functional configurations across the codebase:

Primary Background: A premium, dark, multi-layered gradient.

Tailwind classes: bg-gradient-to-br from-violet-950 via-slate-950 to-neutral-900

Ambient Backdrops: Low-opacity, ultra-blurred violet radial spots to add depth:

Top-Left: bg-violet-950/10 with blur-[150px]

Bottom-Right: bg-violet-950/15 with blur-[150px]

Canvas Particles: Dotted background particles must render soft, deep violet colors with high-performance repulsion mechanics.

Recommended color: #6d28d9 (Tailwind violet-700 equivalent) or rgba(109, 40, 217, 0.4)

2. Updated Core Messaging

Startup Slogan: Must be set exactly to solving Indian problems at a time.. (all lowercase, ending with double periods).

Placement: Centered directly below our revolving logo system in the primary Hero Section.

3. Core Interaction Architecture

Feature A: The Revolving Scroll Logo

Initial State: Rendered center-screen, high prominence, with a proximity-based glow.

Scroll Transform Mapping: Link the scroll progress from scrollY = 0 to scrollY = 600 to a dynamic transformation function:

Rotation (Revolution): $0^{\circ} \rightarrow 360^{\circ}$ (smooth linear curve).

Scale: 1.0 scale down to 0.45 scale.

Translation: Float upwards out of focus as the main product sections scroll into view.

Proximity Glow: Keep mouse distance tracking active. Moving the cursor within $300\text{px}$ of the logo container scales a neon violet drop-shadow from $0\%$ to $100\%$ intensity.

Feature B: NCR-BHK Tinder-Style Swiper

Ecosystem Description: Next-Gen Smart Rental Ecosystem for listing PGs, flats, apartments, and matching with clean roommates.

Sandbox Component: Must include a playable Tinder Swipe container allowing prospects to swipe left (Pass) or right (Match) with dynamic response states.

Feature C: Project NOVA Agent Terminal

Ecosystem Description: B2B Multi-Agent AI Procurement platform that automates the processing of dense RFPs (SAIL, GAIL, BHEL) and optimizes bid creation.

Sandbox Component: Build a clean console container displaying real-time agent execution logs (Parser $\rightarrow$ Auditor $\rightarrow$ Estimator $\rightarrow$ Draft Master) triggered by a simulated execution button.

4. Founder Team Records

Render dedicated profile grids with custom hover interactions using these exact bio structures and hyperlinks:

Founder Profile: Siddharth Yadav

Title: Founder & Lead Engineer

Responsibilities: Directing strategic technical architectures, model scaling, and foundational multi-agent protocols.

LinkedIn URL: https://www.linkedin.com/in/siddharth-yadav-1b3b8a328/

GitHub URL: https://github.com/SIDX9726

Email Anchor: contact@sidhiai.in

Co-Founder Profile: Himanshu Dhiman

Title: Co-Founder & Product Head

Responsibilities: Leading product lifecycle designs, interactive user experiences, and client integrations.

LinkedIn URL: https://www.linkedin.com/in/himanshu-dhiman-b30611321

GitHub URL: https://github.com/ddd047/

Email Anchor: contact@sidhiai.in

5. Production Reference Blueprint

"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Linkedin, Github, Mail, Sparkles, UserCheck } from 'lucide-react';

export default function StartupLanding() {
  const [glowIntensity, setGlowIntensity] = useState(0);
  const logoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trackProximity = (e: globalThis.MouseEvent) => {
      if (!logoContainerRef.current) return;
      const box = logoContainerRef.current.getBoundingClientRect();
      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const activeRange = 300;

      if (distance < activeRange) {
        setGlowIntensity((activeRange - distance) / activeRange);
      } else {
        setGlowIntensity(0);
      }
    };

    window.addEventListener('mousemove', trackProximity);
    return () => window.removeEventListener('mousemove', trackProximity);
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Dynamic Deep Royal Violet Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-950 via-slate-950 to-neutral-900 -z-10" />

      {/* Centered Slogan */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs text-violet-300 font-semibold mb-6">
          <Sparkles size={12} /> Live Environment
        </div>
        
        {/* Dynamic Glowing Logo Anchor */}
        <div 
          ref={logoContainerRef}
          className="w-32 h-32 bg-slate-900 border border-violet-500/30 rounded-3xl mb-8 flex items-center justify-center font-bold text-5xl font-serif text-violet-200 transition-shadow duration-100"
          style={{
            boxShadow: `0 0 ${glowIntensity * 40}px rgba(109, 40, 217, ${0.2 + glowIntensity * 0.7})`
          }}
        >
          S
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-3xl">
          solving Indian problems at a time..
        </h1>
      </div>
    </main>
  );
}
