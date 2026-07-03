"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Mail, Sparkles, RefreshCw, Terminal, Heart, X, Check } from "lucide-react";
import NeuralNetworkBackground from "./NeuralNetworkBackground";

/* ── SVG Icons ───────────────────────────────────────────── */
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width={props.width || 14} height={props.height || 14} {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width={props.width || 14} height={props.height || 14} {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

/* ── Data ────────────────────────────────────────────────── */
interface FlatmateProfile {
  id: number; name: string; age: number; role: string;
  location: string; cleanliness: string; bio: string; hobbies: string[];
}

const mockProfiles: FlatmateProfile[] = [
  { id: 1, name: "Aarav Sharma",    age: 24, role: "SDE @ FinTech",     location: "Gurugram, Sector 45",
    cleanliness: "9/10 (Super Clean)",  bio: "Looking for a quiet room. Mostly busy with coding and gym. Loves filter coffee.",             hobbies: ["Gym","Coding","Cooking"] },
  { id: 2, name: "Vikram Malhotra", age: 25, role: "UX Designer",       location: "Noida, Sector 62",
    cleanliness: "8/10 (Organized)",    bio: "Friendly, non-smoker. Plays acoustic guitar and loves weekend board games.",                  hobbies: ["Music","Board Games","Sketching"] },
  { id: 3, name: "Rohan Verma",     age: 26, role: "Product Manager",   location: "Delhi, Hauz Khas",
    cleanliness: "9.5/10 (Neat Freak)", bio: "Loves minimalist spaces. Cleanliness is a top priority. Vegetarian. Quiet weekends.",        hobbies: ["Reading","Yoga","Minimalism"] },
];

const terminalLogsTemplate = [
  { agent: "Parser Agent",    message: "Loading dense GAIL RFP Section 4.2 (Technical Scope)..." },
  { agent: "Parser Agent",    message: "Extracted 42 compliance specifications and 15 deliverables." },
  { agent: "Auditor Agent",   message: "Verifying SAIL clauses for commercial compliance..." },
  { agent: "Auditor Agent",   message: "Audit flag raised: Section 8.3 — high penalty ceiling (10% max)." },
  { agent: "Estimator Agent", message: "Calculating OEM vendor estimation parameters..." },
  { agent: "Estimator Agent", message: "Proposed material costing: INR 4.8 Crores (Margin: 18.5%)." },
  { agent: "Draft Master",    message: "Generating automatic bid proposal (standard templates)..." },
  { agent: "Draft Master",    message: "✓ Bid proposal generated: proposal_GAIL_v2.docx" },
];

const founders = [
  {
    initials: "SY", name: "Siddharth Yadav", title: "Founder & Lead Engineer",
    bio: "Directing strategic technical architectures, model scaling, and foundational multi-agent protocols.",
    linkedin: "https://www.linkedin.com/in/siddharth-yadav-1b3b8a328/",
    github:   "https://github.com/SIDX9726",
    grad:     "linear-gradient(135deg, #4c1d95, #312e81)",
  },
  {
    initials: "HD", name: "Himanshu Dhiman", title: "Co-Founder & Product Head",
    bio: "Leading product lifecycle designs, interactive user experiences, and client integrations.",
    linkedin: "https://www.linkedin.com/in/himanshu-dhiman-b30611321",
    github:   "https://github.com/ddd047/",
    grad:     "linear-gradient(135deg, #1e1b4b, #4c1d95)",
  },
];


/* ── Main Component ──────────────────────────────────────── */
export default function LandingPage() {
  const logoRef = useRef<HTMLDivElement>(null);
  const [mounted,      setMounted]      = useState(false);
  const [scrollY,      setScrollY]      = useState(0);
  const [glowIntensity,setGlowIntensity]= useState(0);

  /* Swiper */
  const [profileIndex, setProfileIndex] = useState(0);
  const [swipeDir,     setSwipeDir]     = useState<"left"|"right"|null>(null);
  const [matched,      setMatched]      = useState(false);
  const dragStartX = useRef<number | null>(null);

  /* Terminal */
  const [terminalRunning, setTerminalRunning] = useState(false);
  const [terminalLogs,    setTerminalLogs]    = useState<{agent:string;message:string;timestamp:string}[]>([]);
  const [logIndex,        setLogIndex]        = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const track = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const box = logoRef.current.getBoundingClientRect();
      const cx  = box.left + box.width  / 2;
      const cy  = box.top  + box.height / 2;
      const d   = Math.hypot(e.clientX - cx, e.clientY - cy);
      const range = 320;
      setGlowIntensity(d < range ? (range - d) / range : 0);
    };
    window.addEventListener("mousemove", track);
    return () => window.removeEventListener("mousemove", track);
  }, []);

  /* Scroll-auto into terminal logs */
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  /* ── Swiper ── */
  const handleSwipe = useCallback((dir: "left"|"right") => {
    if (swipeDir) return;
    setSwipeDir(dir);
    setTimeout(() => {
      if (dir === "right") { setMatched(true); setTimeout(() => setMatched(false), 1800); }
      setSwipeDir(null);
      setProfileIndex(p => (p + 1) % mockProfiles.length);
    }, 400);
  }, [swipeDir]);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };
  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const delta = endX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) > 60) handleSwipe(delta > 0 ? "right" : "left");
  };

  /* ── Terminal ── */
  const runBidAnalysis = () => {
    if (terminalRunning) return;
    setTerminalRunning(true);
    setTerminalLogs([]);
    setLogIndex(0);
  };

  useEffect(() => {
    if (!terminalRunning) return;
    if (logIndex >= terminalLogsTemplate.length) { setTerminalRunning(false); return; }
    const t = setTimeout(() => {
      const now = new Date();
      const ts = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
      setTerminalLogs(prev => [...prev, { ...terminalLogsTemplate[logIndex], timestamp: ts }]);
      setLogIndex(p => p + 1);
    }, 820);
    return () => clearTimeout(t);
  }, [terminalRunning, logIndex]);

  /* ── Scroll transforms ── */
  const progress    = Math.min(1, scrollY / 600);
  const scale       = 1 - progress * 0.55;
  const rotateY     = progress * 1080;
  const translateY  = progress * -250;
  const heroOpacity = Math.max(0, 1 - progress * 1.6);
  const glowBlur    = Math.round(glowIntensity * 90);
  const glowAlpha   = 0.18 + glowIntensity * 0.82;

  if (!mounted) return null;

  const profile = mockProfiles[profileIndex];

  return (
    <main className="relative min-h-screen text-white selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">

      {/* ── Black → Purple gradient base ─────────────────── */}
      <div className="fixed inset-0 -z-30"
        style={{ background: "linear-gradient(160deg, #000000 0%, #0d0020 30%, #1a0040 55%, #3b0080 80%, #6d28d9 100%)" }}
      />

      {/* ── Ambient depth orbs ───────────────────────────── */}
      <div className="fixed -top-32 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full pointer-events-none -z-20"
        style={{ background: "radial-gradient(ellipse, rgba(109,40,217,0.45) 0%, rgba(76,29,149,0.2) 50%, transparent 75%)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 right-0 w-[60vw] h-[60vw] rounded-full pointer-events-none -z-20"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.5) 0%, rgba(109,40,217,0.2) 45%, transparent 70%)", filter: "blur(90px)" }} />
      <div className="fixed bottom-0 left-0 w-[50vw] h-[50vw] rounded-full pointer-events-none -z-20"
        style={{ background: "radial-gradient(circle, rgba(88,28,135,0.4) 0%, transparent 70%)", filter: "blur(80px)" }} />

      {/* ── Neural Network Canvas (sits between bg and content) */}
      <div className="fixed inset-0" style={{ zIndex: 0, pointerEvents: "none" }}>
        <NeuralNetworkBackground />
      </div>

      {/* ─────────────────────────────────────────────────────
          All page content wrapped at z-index 1
      ───────────────────────────────────────────────────── */}
      <div className="relative" style={{ zIndex: 1 }}>

        {/* ══════════════════════════════════════════════════
            SECTION 1 — HERO
        ══════════════════════════════════════════════════ */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">

          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-full border text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(109,40,217,0.15)", borderColor: "rgba(139,92,246,0.4)", color: "#c4b5fd",
              opacity: heroOpacity, boxShadow: "0 0 24px rgba(109,40,217,0.25)",
            }}
          >
            <Sparkles size={11} className="animate-pulse text-violet-400" />
            Live Environment
          </div>

          {/* Revolving logo — Y-axis flip on scroll */}
          <div style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}>
            <div
              ref={logoRef}
              className="select-none"
              style={{
                transform:  `translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg)`,
                filter:     `drop-shadow(0 0 ${glowBlur}px rgba(139,92,246,${glowAlpha})) drop-shadow(0 0 ${Math.round(glowBlur*0.45)}px rgba(167,139,250,${glowAlpha*0.5}))`,
                transition: "filter 0.12s ease-out",
                willChange: "transform, filter",
                transformStyle: "preserve-3d",
              }}
            >
              <Image
                src="/SidhiAI.svg"
                alt="SIDHI AI Logo"
                width={480}
                height={480}
                priority
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 400px, 480px"
                className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px]"
                style={{ filter: "brightness(1.2) saturate(1.3)" }}
              />
            </div>
          </div>

          {/* Slogan */}
          <div className="flex flex-col items-center mt-8 pointer-events-none"
            style={{ opacity: heroOpacity, transition: "opacity 0.05s linear" }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-3xl"
              style={{ background: "linear-gradient(135deg,#ffffff 0%,#e9d5ff 50%,#a855f7 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              solving Indian problems<br />
              <span style={{ color:"#c084fc", WebkitTextFillColor:"#c084fc" }}>at a time..</span>
            </h1>
            <p className="text-violet-400/70 mt-6 text-xs font-mono uppercase tracking-[0.3em] animate-pulse">
              ↓ scroll to explore
            </p>
          </div>

          {/* Bottom vignette matching gradient end */}
          <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
        </section>

        <div className="h-[15vh]" />

        {/* ══════════════════════════════════════════════════
            SECTION 2 — PRODUCTS
        ══════════════════════════════════════════════════ */}
        <section id="products" className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="animate-section-in">
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-5 border"
                style={{ background:"rgba(109,40,217,0.12)", borderColor:"rgba(139,92,246,0.3)", color:"#a78bfa" }}>
                INTERACTIVE SANDBOXES
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight"
                style={{ background:"linear-gradient(135deg,#ffffff 0%,#c4b5fd 60%,#8b5cf6 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Product Ecosystems
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

              {/* ── NCR-BHK Swiper ── */}
              <ProductCard>
                <div className="flex items-center gap-3 mb-3">
                  <Pill>Project A</Pill>
                  <h3 className="text-2xl font-black text-white">NCR-BHK</h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed mb-7">
                  Next-Gen Smart Rental Ecosystem — search PGs, list flats, and match with verified clean roommates across NCR.
                </p>

                <div className="relative flex flex-col items-center justify-center flex-1 min-h-[400px] rounded-2xl overflow-hidden p-6"
                  style={{ background:"rgba(5,2,15,0.7)", border:"1px solid rgba(109,40,217,0.18)" }}>

                  {/* Match overlay */}
                  {matched && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
                      style={{ background:"rgba(46,16,101,0.95)", backdropFilter:"blur(6px)" }}>
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                        style={{ background:"rgba(139,92,246,0.2)", border:"2px solid rgba(167,139,250,0.5)", boxShadow:"0 0 30px rgba(139,92,246,0.5)" }}>
                        <Heart size={36} className="text-violet-300 fill-violet-300 animate-bounce" />
                      </div>
                      <h4 className="text-2xl font-black text-white mb-1">It&apos;s a Match! 🎉</h4>
                      <p className="text-sm text-violet-300/80">Roommate profile connected.</p>
                    </div>
                  )}

                  {/* Swipeable card — supports mouse drag + touch */}
                  <div
                    className="w-full max-w-[290px] rounded-2xl p-5 cursor-grab active:cursor-grabbing select-none"
                    style={{
                      background:  "linear-gradient(160deg,rgba(20,8,40,0.97) 0%,rgba(10,4,25,0.97) 100%)",
                      border:      "1px solid rgba(139,92,246,0.28)",
                      boxShadow:   "0 20px 60px rgba(0,0,0,0.55)",
                      transform:   swipeDir==="left"  ? "translateX(-160%) rotate(-18deg)"
                                 : swipeDir==="right" ? "translateX(160%) rotate(18deg)"
                                 : "none",
                      opacity:     swipeDir ? 0 : 1,
                      transition:  swipeDir ? "transform 0.38s ease-in, opacity 0.28s ease-in" : "none",
                    }}
                    onMouseDown={onDragStart}
                    onMouseUp={onDragEnd}
                    onTouchStart={onDragStart}
                    onTouchEnd={onDragEnd}
                  >
                    {/* Avatar */}
                    <div className="w-full h-28 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                      style={{ background:"linear-gradient(135deg,#3b0764,#1e1b4b)", border:"1px solid rgba(139,92,246,0.3)" }}>
                      <div className="absolute inset-0"
                        style={{ background:"radial-gradient(circle at 30% 40%,rgba(167,139,250,0.18) 0%,transparent 60%)" }} />
                      <span className="text-6xl font-black text-white/20">{profile.name[0]}</span>
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                        style={{ background:"rgba(0,0,0,0.65)", border:"1px solid rgba(139,92,246,0.45)", color:"#c4b5fd" }}>
                        <Sparkles size={8} /> Roommate
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white flex items-baseline gap-2 mb-0.5">
                      {profile.name}
                      <span className="text-sm font-normal text-neutral-400">{profile.age}</span>
                    </h4>
                    <p className="text-xs font-semibold mb-2" style={{ color:"#a78bfa" }}>{profile.role}</p>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">&ldquo;{profile.bio}&rdquo;</p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {profile.hobbies.map((h,i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded text-neutral-300"
                          style={{ background:"rgba(30,20,50,0.8)", border:"1px solid rgba(100,80,150,0.3)" }}>
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] flex items-center gap-1" style={{ color:"#c4b5fd" }}>
                      <Check size={10} /> Cleanliness: <strong>{profile.cleanliness}</strong>
                    </div>

                    {/* Drag hint */}
                    <p className="text-center text-[10px] text-neutral-600 mt-3">← drag to pass · drag to like →</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-8 mt-6">
                    <SwipeBtn color="rose" onClick={() => handleSwipe("left")}  title="Pass"><X size={22}/></SwipeBtn>
                    <SwipeBtn color="emerald" onClick={() => handleSwipe("right")} title="Like"><Heart size={22} className="fill-current"/></SwipeBtn>
                  </div>
                </div>
              </ProductCard>

              {/* ── NOVA Terminal ── */}
              <ProductCard>
                <div className="flex items-center gap-3 mb-3">
                  <Pill>Project B</Pill>
                  <h3 className="text-2xl font-black text-white">Project NOVA</h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed mb-7">
                  B2B Multi-Agent AI Procurement platform — automates dense RFP processing (SAIL, GAIL, BHEL) and optimizes bid creation.
                </p>

                <div className="relative flex flex-col flex-1 min-h-[400px] rounded-2xl overflow-hidden font-mono text-xs"
                  style={{ background:"#04010d", border:"1px solid rgba(109,40,217,0.25)" }}>

                  {/* Title bar */}
                  <div className="flex items-center justify-between px-4 py-3"
                    style={{ background:"rgba(10,4,24,0.95)", borderBottom:"1px solid rgba(109,40,217,0.18)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background:"#ef4444" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background:"#f59e0b" }} />
                      <div className="w-3 h-3 rounded-full" style={{ background:"#10b981" }} />
                      <span className="ml-3 text-[11px]" style={{ color:"#4b5563" }}>nova-agent-shell — GAIL RFP</span>
                    </div>
                    <Terminal size={13} style={{ color:"#8b5cf6" }} />
                  </div>

                  {/* Logs area */}
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ maxHeight:"290px" }}>
                    {terminalLogs.length === 0 ? (
                      <p className="italic" style={{ color:"#374151" }}>
                        Terminal idle. Click &quot;Run Bid Analysis&quot; to fire the multi-agent pipeline.
                      </p>
                    ) : terminalLogs.map((log, i) => (
                      <div key={i} className="animate-fade-in space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span style={{ color:"#374151" }}>[{log.timestamp}]</span>
                          <span className="font-bold" style={{ color:"#34d399" }}>{log.agent}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background:"rgba(52,211,153,0.1)", color:"#6ee7b7" }}>active</span>
                        </div>
                        <div className="pl-4" style={{ color:"#d1d5db" }}>{log.message}</div>
                      </div>
                    ))}
                    {terminalRunning && (
                      <div className="flex items-center gap-2 pl-4 animate-fade-in" style={{ color:"#8b5cf6" }}>
                        <RefreshCw size={11} className="animate-spin" />
                        <span>Agent pipeline running...</span>
                      </div>
                    )}
                    <div ref={logsEndRef} />
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-4 flex items-center justify-between"
                    style={{ background:"rgba(6,2,18,0.9)", borderTop:"1px solid rgba(109,40,217,0.14)" }}>
                    <span className="text-[11px]" style={{ color:"#374151" }}>
                      {terminalLogs.length}/{terminalLogsTemplate.length} logs
                    </span>
                    <button
                      onClick={runBidAnalysis}
                      disabled={terminalRunning}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                      style={{
                        background: terminalRunning ? "rgba(109,40,217,0.08)" : "linear-gradient(135deg,#7c3aed,#5b21b6)",
                        border:     "1px solid rgba(139,92,246,0.4)",
                        color:      terminalRunning ? "#4b2d8a" : "#ffffff",
                        boxShadow:  terminalRunning ? "none" : "0 0 22px rgba(124,58,237,0.4)",
                      }}
                    >
                      <RefreshCw size={13} className={terminalRunning ? "animate-spin" : ""} />
                      Run Bid Analysis
                    </button>
                  </div>
                </div>
              </ProductCard>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 3 — TEAM
        ══════════════════════════════════════════════════ */}
        <section id="team" className="relative max-w-4xl mx-auto px-6 py-24">
          <div className="animate-section-in" style={{ animationDelay: "0.1s" }}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-5 border"
                style={{ background:"rgba(109,40,217,0.12)", borderColor:"rgba(139,92,246,0.3)", color:"#a78bfa" }}>
                FOUNDING TEAM
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight"
                style={{ background:"linear-gradient(135deg,#ffffff 0%,#c4b5fd 60%,#8b5cf6 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                The Builders
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {founders.map(person => (
                <div
                  key={person.name}
                  className="group flex flex-col items-center text-center rounded-3xl p-8 relative overflow-hidden"
                  style={{
                    background:    "linear-gradient(160deg,rgba(12,4,28,0.95) 0%,rgba(8,3,20,0.92) 100%)",
                    border:        "1px solid rgba(139,92,246,0.2)",
                    backdropFilter:"blur(20px)",
                    boxShadow:     "0 8px 40px rgba(109,40,217,0.12)",
                    transition:    "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow  = "0 20px 60px rgba(109,40,217,0.35), 0 0 0 1px rgba(167,139,250,0.4)";
                    e.currentTarget.style.transform  = "translateY(-5px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow  = "0 8px 40px rgba(109,40,217,0.12)";
                    e.currentTarget.style.transform  = "translateY(0)";
                  }}
                >
                  {/* Holographic shimmer layer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background:"linear-gradient(135deg,rgba(167,139,250,0.07) 0%,transparent 50%,rgba(99,102,241,0.07) 100%)" }} />

                  {/* Holographic sweep line */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden rounded-3xl">
                    <div style={{
                      position:"absolute", top:0, left:"-60%", width:"40%", height:"100%",
                      background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)",
                      transform:"skewX(-20deg)", animation:"sweep 0.7s ease forwards",
                    }} />
                  </div>

                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden"
                    style={{ background:person.grad, border:"1px solid rgba(139,92,246,0.45)", boxShadow:"0 8px 32px rgba(109,40,217,0.35)" }}>
                    <span className="text-3xl font-black" style={{ color:"rgba(196,181,253,0.9)" }}>{person.initials}</span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background:"linear-gradient(135deg,rgba(167,139,250,0.28) 0%,transparent 60%)" }} />
                  </div>

                  <h3 className="text-xl font-black text-white mb-1 group-hover:text-violet-200 transition-colors">{person.name}</h3>
                  <p className="text-xs font-semibold mb-4" style={{ color:"#a78bfa" }}>{person.title}</p>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-7 max-w-xs">{person.bio}</p>

                  <div className="flex items-center gap-3">
                    {[
                      { href:person.linkedin, icon:<LinkedInIcon />, label:"LinkedIn" },
                      { href:person.github,   icon:<GitHubIcon   />, label:"GitHub"   },
                      { href:"mailto:contact@sidhiai.in", icon:<Mail size={14}/>, label:"Email" },
                    ].map(({ href, icon, label }) => (
                      <a key={label} href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                        style={{ background:"rgba(8,3,18,0.9)", border:"1px solid rgba(80,60,120,0.4)", color:"#6b7280" }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color       = "#c4b5fd";
                          e.currentTarget.style.borderColor = "rgba(139,92,246,0.65)";
                          e.currentTarget.style.boxShadow   = "0 0 16px rgba(109,40,217,0.4)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color       = "#6b7280";
                          e.currentTarget.style.borderColor = "rgba(80,60,120,0.4)";
                          e.currentTarget.style.boxShadow   = "none";
                        }}
                      >
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 4 — FOOTER
        ══════════════════════════════════════════════════ */}
        <footer className="relative py-12"
          style={{ borderTop:"1px solid rgba(109,40,217,0.18)", background:"rgba(0,0,0,0.55)", backdropFilter:"blur(12px)" }}>
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Image src="/logo-v2.svg" alt="SIDHI AI" width={30} height={30}
                style={{ opacity:0.75, filter:"brightness(1.2)" }} />
              <div>
                <p className="text-xs font-mono" style={{ color:"#4b5563" }}>
                  © {new Date().getFullYear()} SIDHI AI. All rights reserved.
                </p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color:"rgba(139,92,246,0.55)" }}>
                  solving Indian problems at a time..
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <a href="https://sidhiai.in" target="_blank" rel="noopener noreferrer"
                className="text-xs font-bold tracking-wide"
                style={{ color:"#8b5cf6" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c4b5fd")}
                onMouseLeave={e => (e.currentTarget.style.color = "#8b5cf6")}>
                sidhiai.in
              </a>
              <div className="h-4 w-px" style={{ background:"rgba(109,40,217,0.25)" }} />
              {[
                { href:"#products",                  label:"Products" },
                { href:"#team",                      label:"Team"     },
                { href:"mailto:contact@sidhiai.in",  label:"Support"  },
              ].map(({ href, label }) => (
                <a key={label} href={href} className="text-xs" style={{ color:"#4b5563" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#8b5cf6")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </div>{/* end z-index 1 wrapper */}
    </main>
  );
}

/* ── Small shared sub-components ─────────────────────────── */

function ProductCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="group flex flex-col h-full rounded-3xl p-8 transition-all duration-300"
      style={{
        background:    "linear-gradient(145deg,rgba(12,4,28,0.9) 0%,rgba(18,6,42,0.88) 100%)",
        border:        "1px solid rgba(139,92,246,0.2)",
        backdropFilter:"blur(18px)",
        boxShadow:     "0 8px 40px rgba(109,40,217,0.14), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 14px 60px rgba(109,40,217,0.3), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(139,92,246,0.38)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 8px 40px rgba(109,40,217,0.14), inset 0 1px 0 rgba(255,255,255,0.04)")}
    >
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold"
      style={{ background:"rgba(139,92,246,0.15)", color:"#a78bfa", border:"1px solid rgba(139,92,246,0.32)" }}>
      {children}
    </span>
  );
}

function SwipeBtn({ children, color, onClick, title }: {
  children: React.ReactNode;
  color: "rose"|"emerald";
  onClick: ()=>void;
  title: string;
}) {
  const c = color === "rose"
    ? { border:"rgba(239,68,68,0.38)", text:"#f87171",  glow:"rgba(239,68,68,0.35)"  }
    : { border:"rgba(52,211,153,0.38)",text:"#34d399",  glow:"rgba(52,211,153,0.35)" };
  return (
    <button onClick={onClick} title={title}
      className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer"
      style={{ background:"rgba(10,4,20,0.9)", border:`1px solid ${c.border}`, color:c.text }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 22px ${c.glow}`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
      {children}
    </button>
  );
}
