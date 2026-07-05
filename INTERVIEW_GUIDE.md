# SIDHI AI Landing Page - Technical & Interview Guide

This guide explains the architecture, tech stack, codebase structure, and interactive features of the SIDHI AI landing page, followed by a compilation of core technical concepts commonly asked in web development interviews.

---

## 📂 Project Structure & Architecture

The application is built using **Next.js (App Router)** and **React 19**, written in **TypeScript**, and styled with **Tailwind CSS v4**.

```
LandingPage/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Root Entry (Server Component)
│   │   ├── layout.tsx             # Root HTML Layout & Font Setup
│   │   └── globals.css            # Custom CSS Keyframes, Scrollbars & Variables
│   ├── components/
│   │   ├── LandingPage.tsx        # Client Application Core Logic
│   │   └── NeuralNetworkBackground.tsx # Interactive HTML5 Canvas Particles
└── INTERVIEW_GUIDE.md             # This Document
```

### How the Code Executes
1. **Request Entry**: Next.js App Router serves `/src/app/page.tsx` as a Server Component.
2. **Client Hydration**: Since `page.tsx` renders `LandingPage.tsx` (which is marked with `"use client"`), React hydrates the page on the client browser.
3. **Canvas Init**: Once mounted, `NeuralNetworkBackground.tsx` runs inside a React `useEffect`, capturing the screen dimensions and starting a high-performance rendering loop using the HTML5 Canvas API and `requestAnimationFrame`.
4. **Scroll & Interaction Observers**:
   - Global scroll listener recalculates the Y-axis rotation and opacity of the watermark `logo.svg` in real time.
   - Two `IntersectionObserver` instances track the "Product Ecosystems" and "Builders" sections to trigger their split-out entrance animations the moment they cross the viewport.

---

## 🛠️ Technology Stack & Dependencies

| Tech / Library | File / Location | Why & Where Used |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | `src/app/` | Provides SSR capabilities, routing, and built-in image optimization (`next/image`). |
| **React 19 (Client Context)** | `src/components/` | Manages complex interactive states (Tinder swiping, terminal simulation, active scroll values). |
| **HTML5 Canvas API** | `NeuralNetworkBackground.tsx` | Used instead of third-party particle libraries for maximum frame rates, low memory footprint, and customized mouse repulsion physics. |
| **Tailwind CSS v4** | Throughout | Fast, utility-first CSS styling. Handles dark-mode palettes, responsive layouts (`lg:grid-cols-2`), and modern grid spacing. |
| **Lucide React** | `LandingPage.tsx` | Provides futuristic, clean icons (e.g., `Terminal`, `Users`, `Mail`). |

---

## 🚀 Deep-Dive into Key Features

### 1. High-Performance Particle Network (`NeuralNetworkBackground.tsx`)
- **Physics**: Particle positions ($x, y$) update every frame by adding velocity vectors ($vx, vy$). When particles approach the boundaries, they bounce.
- **Mouse Repulsion**: Calculates the Euclidean distance between the cursor and every particle:
  $$d = \sqrt{(x_{mouse} - x)^2 + (y_{mouse} - y)^2}$$
  If $d$ is less than a radius threshold, the particle is pushed away along the cursor-to-particle vector.
- **Connection Lines**: Lines are drawn between particles within `100px` of each other. Line opacity scales inversely with distance, giving a clean, fade-out effect.
- **Optimized Rendering**: The script uses direct canvas context (`ctx`) draw calls in a single frame pass to minimize CPU overhead.

### 2. Y-Axis Flipping & Watermark Logo (`LandingPage.tsx`)
- **Hero Logo**: Multiplies `scrollY` by a factor to spin the hero logo up to `1080°` dynamically during scroll.
- **Watermark Logo**:
  - Automatically hidden in the hero section (`scrollY < 500`).
  - Fades in up to `40%` opacity and slowly spins on the Y-axis as the user scrolls.
  - Slowly dissolves to `0%` opacity when approaching the bottom of the page (`75%` to `100%` of document height).

### 3. Scroll Reveal Entrance Animations (`globals.css` + `LandingPage.tsx`)
- Uses a custom React hook `useCardReveal` that sets up a browser `IntersectionObserver`.
- Attach the observer directly to the section grid container.
- When triggered, it flips a state `fired` to `true`, which swaps the styling class from `.card-split-pending` (`opacity: 0`) to either `.card-from-left` or `.card-from-right` which animate elements outward from the center.

---

## 🎓 Interview Topics & Mock Questions

### 1. Next.js & React Core Concepts

#### Q: What is the difference between Server Components and Client Components in Next.js?
* **Server Components (Default)**: Rendered on the server. They don't ship JS to the client, leading to faster page loads and better SEO. They cannot use state, effects, or browser-only APIs (like `window` or `document`).
* **Client Components (indicated by `"use client"`)**: Hydrated on the client side. They allow user interactions, React hooks (`useState`, `useEffect`, `useRef`), and browser APIs.
* *Application*: `src/app/page.tsx` is a Server Component, but it mounts `LandingPage.tsx` which is marked `"use client"` because it handles heavy client interactions, scroll tracking, and canvas rendering.

#### Q: How does Next.js's `<Image>` component optimize images?
* It automatically prevents **Layout Shift** (CLS - Cumulative Layout Shift) by requiring aspect ratios or explicit heights/widths.
* It optimizes, compresses, and serves modern image formats (like WebP/AVIF) based on screen resolution and browser support.
* It lazy-loads images below the fold by default.
* *Application*: In `LandingPage.tsx`, we used `<Image>` and set style `height: "auto"` to preserve the aspect ratio while customizing the width responsively.

---

### 2. DOM & Web APIs (Intersection Observer)

#### Q: Why is `IntersectionObserver` preferred over window scroll event listeners for scroll-reveal animations?
* **Scroll Event Listener (`window.addEventListener('scroll')`)**: Fires constantly on the main thread during scrolling. Checking coordinates (`getBoundingClientRect()`) forces the browser to recalculate layouts, leading to **Layout Thrashing** and frame drops (jank).
* **Intersection Observer**: Runs asynchronously, decoupled from the main thread. It only alerts the browser when an element crosses a specific visibility threshold, making it vastly more performant.

#### Q: You encountered a bug where cards remained invisible because of an Intersection Observer threshold. Explain what happened and how you fixed it.
* **The Problem**: A threshold of `0.15` requires 15% of the observed element to be visible in the viewport. If the element is very tall (like stacked cards on mobile), it might be physically impossible for 15% of it to fit in the viewport at the same time. Hence, the observer never fires.
* **The Solution**: Set the threshold to `0` (fires as soon as the first pixel enters) and use `rootMargin: "0px 0px -15% 0px"` to trigger the animation exactly 15% before the element enters the screen.

---

### 3. Graphics & Performance (HTML5 Canvas vs SVG vs DOM)

#### Q: When would you use HTML5 Canvas over SVG or standard DOM elements for animations?
* **DOM / SVG**: Best for high-quality, scalable graphics with a low number of elements. Every element is part of the DOM tree, meaning they consume memory and trigger reflows/paints when updated.
* **Canvas**: Best for high-frequency rendering and high node counts (like thousands of particle points). Canvas is a raster drawing surface. The browser doesn't maintain state for drawn objects—it just modifies pixels. It is extremely fast but lacks built-in event handling for individual particles.

#### Q: How do you optimize high-rate animations in Javascript?
* **Use `requestAnimationFrame` instead of `setInterval`**: `requestAnimationFrame` aligns execution with the browser's refresh cycle (usually 60Hz or 120Hz) and pauses automatically when the user switches tabs, saving CPU/GPU cycles.
* **Avoid GC (Garbage Collection) pauses**: Instantiate objects (like particle vectors) once and reuse them instead of recreating them inside the rendering loop.

---

### 4. CSS & Styling

#### Q: Explain how the "Slide Out from Center" animation works in CSS.
We define keyframes that start elements with an offset toward the horizontal center of the parent container:
```css
@keyframes slideFromCenter_left {
  from { opacity: 0; transform: translateX(55%); }
  to   { opacity: 1; transform: translateX(0);   }
}
@keyframes slideFromCenter_right {
  from { opacity: 0; transform: translateX(-55%); }
  to   { opacity: 1; transform: translateX(0);    }
}
```
* The left card moves left (animating from `translateX(55%)` to `0`).
* The right card moves right (animating from `translateX(-55%)` to `0`).
* Combined with a cubic-bezier timing function (`cubic-bezier(0.16, 1, 0.3, 1)`), it yields an extremely premium, springy decelerating effect.
