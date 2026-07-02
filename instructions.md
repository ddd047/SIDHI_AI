Hi Antigravity,

I want to build a premium, highly immersive, dynamic single-page landing gate for my startup. The design needs to be minimal, clean, futuristic, and responsive to user input. Below are the precise design tokens, technical requirements, and core interactive logic for this front-end interface.

1. Design & Core Aesthetic

    Layout: A single, full-viewport screen (100vh / 100dvh) that does not scroll. Everything is centered, clean, and entirely free of clutter.

    Background Visual: A deep, rich, fluid dark gradient blending black into deep midnight purple.

        Implementation Variant: Tailwind classes bg-gradient-to-br from-black via-neutral-950 to-purple-950.

    Foreground Elements: When a customer opens the page, they should only see our central logo and our main punchline headline centered perfectly in the viewport.

2. Selected Tech StackTo ensure a high-performance interactive experience that maintains a smooth 60fps + frame rate across modern devices, we are standardizing on:
    Frontend Framework: Next.js (App Router component architecture)

    Styling Engine: Tailwind CSS (for gradients, typography, and responsive layouts)

    Physics/Particle Engine: tsParticles (@tsparticles/react & @tsparticles/slim) to handle hardware-accelerated canvas elements.

3. Interactive Mechanics & Physics Specifications
Feature A: The Antigravity Dotted Background

    The background must feature a clean, low-opacity uniform field of subtle dots.

    Cursor Physics: As the user moves their mouse cursor across the page, the particles must act as if they are physically repelled by the cursor, smoothly scattering away from its radius.

    Return Behavior: Once the cursor leaves an area, the dots should smoothly return to their natural original coordinates without snapping abruptly.

    tsParticles Targets: interactivity.events.onHover.mode: "repulse", setting an active interaction radius of roughly 150px.

Feature B: Proximity-Based Interactive Logo Glow
    The central startup logo needs to dynamically sense the cursor’s spatial location.

    Glow Behavior: When the user moves their mouse around the screen and enters a specific activation radius (eg 250px) relative to the logo, the logo should begin to emit a smooth, vibrant purple neon glow.

    Dynamic Scaling: The glow must not just turn on and off. The intensity and radius of the purple drop-shadow must scale dynamically based on distance: the closer the cursor gets to the center of the logo, the brighter and more intense the neon purple glow becomes.

4. Production Component Template (React / Next.js)

To help kick off the build immediately, here is the structural baseline setup for the landing page component combining the tracking hooks and the particle configurations in first.tsx

i have put the logo in SidhiAI.svg



