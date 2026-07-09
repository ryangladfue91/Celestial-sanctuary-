import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";

interface LunarPhaseDetails {
  id: string;
  name: string;
  icon: string;
  description: string;
  synergyScore: number;
  taurusResonance: string;
  cancerResonance: string;
  synergyAspect: string;
  tideIntensity: number; // 1 to 10
  color: string;
}

const LUNAR_PHASES: LunarPhaseDetails[] = [
  {
    id: "new-moon",
    name: "New Moon",
    icon: "🌑",
    description: "A clean celestial slate. Taurus plants steady practical seeds while Cancer nurtures the quiet emotional soil. Safe, cozy cocooning.",
    synergyScore: 94,
    taurusResonance: "Grounded stillness. Ideal for establishing joint long-term material and security intentions.",
    cancerResonance: "High intuition. A mystical phase for pulling back your shell and replenishing emotional reserves.",
    synergyAspect: "Sextile Harmony (Earth & Water germination)",
    tideIntensity: 3,
    color: "#6b7280"
  },
  {
    id: "waxing-crescent",
    name: "Waxing Crescent",
    icon: "🌒",
    description: "First sliver of lunar light. Taurus provides structure for Cancer's emerging hopes. Whispered dreams start taking physical shape.",
    synergyScore: 91,
    taurusResonance: "Pragmatic planning. Preparing resources, home comforts, or small treats to support growth.",
    cancerResonance: "Vulnerable longing. Articulating tender domestic dreams and seeking silent reassurances.",
    synergyAspect: "Creative Semi-Sextile",
    tideIntensity: 5,
    color: "#a78bfa"
  },
  {
    id: "first-quarter",
    name: "First Quarter",
    icon: "🌓",
    description: "Dynamic tension and action. Taurus's physical stamina anchors Cancer through sudden emotional fluctuations. Overcoming barriers together.",
    synergyScore: 88,
    taurusResonance: "Stoic persistence. Providing a safe physical harbor and calm, unshakeable support.",
    cancerResonance: "Rising emotional tide. Desiring direct, warm verbal contact and comforting reassurance.",
    synergyAspect: "Square Integration (Tension producing resilience)",
    tideIntensity: 7,
    color: "#c084fc"
  },
  {
    id: "waxing-gibbous",
    name: "Waxing Gibbous",
    icon: "🌔",
    description: "Expectant golden glow. Taurus creates comfortable environments to accommodate Cancer's expanding heart. Warm anticipation.",
    synergyScore: 95,
    taurusResonance: "Nesting devotion. Baking, gardening, or selecting cozy items that enrich the sanctuary.",
    cancerResonance: "Nurturing flow. Overflowing with care, creating an aura of safety and deep presence.",
    synergyAspect: "Trine Flow (Effortless element synchronization)",
    tideIntensity: 8,
    color: "#fbbf24"
  },
  {
    id: "full-moon",
    name: "Full Moon",
    icon: "🌕",
    description: "Peak illumination. Cancer's emotional tides reach maximum height, fully absorbed and safely held by Taurus's solid earth bed. Pure magic.",
    synergyScore: 98,
    taurusResonance: "Sensory ecstasy. Heightened sensitivity to touch, delicious food, ambient sound, and nature.",
    cancerResonance: "Clairvoyant empathy. Experiencing complete emotional transparency and deep soul merging.",
    synergyAspect: "Opposition Synthesis (The cosmic dance of flowing and grounding)",
    tideIntensity: 10,
    color: "#f59e0b"
  },
  {
    id: "waning-gibbous",
    name: "Waning Gibbous",
    icon: "🌖",
    description: "Gratitude and wisdom sharing. Exchanging reciprocal feedback on what has blossomed. Grounded peace and emotional security.",
    synergyScore: 93,
    taurusResonance: "Grateful contemplation. Welcoming the harvest of relationship security and nesting comfort.",
    cancerResonance: "Expressive care. Pouring out thankfulness, verbal touch, and sentimental appreciation.",
    synergyAspect: "Trine Integration (Synthesized element harmony)",
    tideIntensity: 8,
    color: "#e879f9"
  },
  {
    id: "last-quarter",
    name: "Last Quarter",
    icon: "🌗",
    description: "Release and reflection. Clearing away old emotional burdens. Taurus helps Cancer organize, sort, and let go of unnecessary worries.",
    synergyScore: 87,
    taurusResonance: "Pragmatic filter. Helping sort through complex feelings with steady, logical kindness.",
    cancerResonance: "Cathartic relief. Shedding heavy tears, letting go of historical hurts, and renewing trust.",
    synergyAspect: "Square Adjustment (Refining relational limits)",
    tideIntensity: 6,
    color: "#818cf8"
  },
  {
    id: "waning-crescent",
    name: "Waning Crescent",
    icon: "🌘",
    description: "Deep surrender and sleep. Total tranquility in the quiet darkness. Taurus and Cancer retreat into absolute silent peace, breathing as one.",
    synergyScore: 96,
    taurusResonance: "Receptive stillness. Enjoying physical proximity without any demand for action.",
    cancerResonance: "Subconscious sanctuary. Shared quietude, deep dreaming, and spiritual alignment.",
    synergyAspect: "Sacred Sextile (Returning energies back to the core)",
    tideIntensity: 4,
    color: "#34d399"
  }
];

export default function CosmicSynergyGraph() {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(4); // Default to Full Moon
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isCycling, setIsCycling] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhase = LUNAR_PHASES[selectedPhaseIdx];

  // Auto-cycle through moon phases
  useEffect(() => {
    if (isCycling) {
      cycleIntervalRef.current = setInterval(() => {
        setSelectedPhaseIdx((prev) => (prev + 1) % LUNAR_PHASES.length);
      }, 3000);
    } else {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
      }
    }
    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, [isCycling]);

  // Handle D3 rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Get current container width (min 300px)
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const width = Math.max(containerWidth, 340);
    const height = 360;
    const centerX = width / 2;
    const centerY = height / 2;

    // Select SVG and clear existing contents
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    
    svg.selectAll("*").remove();

    // Create main defs for gradients and glow filters
    const defs = svg.append("defs");

    // Glow filter
    const filter = defs.append("filter")
      .attr("id", "celestial-glow")
      .attr("x", "-30%")
      .attr("y", "-30%")
      .attr("width", "160%")
      .attr("height", "160%");
    
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "6")
      .attr("result", "blur");
    
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Earth-Green radial gradient for Taurus
    const taurusGrad = defs.append("radialGradient")
      .attr("id", "taurus-glow")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    taurusGrad.append("stop").attr("offset", "0%").attr("stop-color", "rgba(161, 210, 170, 0.4)");
    taurusGrad.append("stop").attr("offset", "100%").attr("stop-color", "rgba(161, 210, 170, 0)");

    // Water-Blue radial gradient for Cancer
    const cancerGrad = defs.append("radialGradient")
      .attr("id", "cancer-glow")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    cancerGrad.append("stop").attr("offset", "0%").attr("stop-color", "rgba(210, 188, 250, 0.4)");
    cancerGrad.append("stop").attr("offset", "100%").attr("stop-color", "rgba(210, 188, 250, 0)");

    // Gold core radial gradient for synergy center
    const coreGrad = defs.append("radialGradient")
      .attr("id", "core-glow")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    coreGrad.append("stop").attr("offset", "0%").attr("stop-color", "rgba(245, 158, 11, 0.5)");
    coreGrad.append("stop").attr("offset", "70%").attr("stop-color", "rgba(210, 188, 250, 0.1)");
    coreGrad.append("stop").attr("offset", "100%").attr("stop-color", "rgba(245, 158, 11, 0)");

    // Define orbits
    const orbits = [70, 110, 145];
    
    // Draw concentric orbital paths
    svg.selectAll(".orbit")
      .data(orbits)
      .enter()
      .append("circle")
      .attr("class", "orbit")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", d => d)
      .attr("fill", "none")
      .attr("stroke", "rgba(255, 255, 255, 0.07)")
      .attr("stroke-dasharray", (d, i) => i === 1 ? "4 4" : "1 3");

    // Dynamic angles for nodes based on structural alignment
    // Taurus (Earth) is fixed in top-right quadrant (around -35 degrees)
    // Cancer (Water) is fixed in bottom-left quadrant (around 145 degrees)
    const taurusAngle = -35 * (Math.PI / 180);
    const cancerAngle = 145 * (Math.PI / 180);

    const taurusR = orbits[2];
    const cancerR = orbits[2];

    const taurusX = centerX + taurusR * Math.cos(taurusAngle);
    const taurusY = centerY + taurusR * Math.sin(taurusAngle);

    const cancerX = centerX + cancerR * Math.cos(cancerAngle);
    const cancerY = centerY + cancerR * Math.sin(cancerAngle);

    // Calculate Moon's position as it orbits around orbits[1]
    // The angle depends on the selected phase index to show physical transit orbit!
    const moonAngleDegrees = (selectedPhaseIdx * (360 / LUNAR_PHASES.length)) - 90;
    const moonAngle = moonAngleDegrees * (Math.PI / 180);
    const moonR = orbits[1];
    const moonX = centerX + moonR * Math.cos(moonAngle);
    const moonY = centerY + moonR * Math.sin(moonAngle);

    // ---------------- Drawing Connecting Synergy Lines ----------------
    // Taurus <-> Cancer Axis (The Bedrock Bond)
    svg.append("path")
      .attr("d", d3.line()([[taurusX, taurusY], [cancerX, cancerY]]))
      .attr("stroke", "rgba(255, 255, 255, 0.12)")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "3 6")
      .attr("fill", "none");

    // Moon -> Taurus connection curve (Earth grounding)
    // We make a Bezier curve curving towards the center
    const ctrlX_T = (moonX + taurusX) / 2 + (centerY - (moonY + taurusY) / 2) * 0.25;
    const ctrlY_T = (moonY + taurusY) / 2 + ((moonX + taurusX) / 2 - centerX) * 0.25;
    const pathMoonTaurus = `M ${moonX} ${moonY} Q ${ctrlX_T} ${ctrlY_T} ${taurusX} ${taurusY}`;

    // Moon -> Cancer connection curve (Water emotional tide)
    const ctrlX_C = (moonX + cancerX) / 2 + (centerY - (moonY + cancerY) / 2) * -0.25;
    const ctrlY_C = (moonY + cancerY) / 2 + ((moonX + cancerX) / 2 - centerX) * -0.25;
    const pathMoonCancer = `M ${moonX} ${moonY} Q ${ctrlX_C} ${ctrlY_C} ${cancerX} ${cancerY}`;

    // Render connection paths with customized speed/opacity based on current lunar phase
    const tidePower = currentPhase.tideIntensity; // 1 to 10
    const dashSpeed = 40 - (tidePower * 3); // Faster offset speed for higher intensity
    
    // Moon-Taurus Path
    const moonTaurusLink = svg.append("path")
      .attr("d", pathMoonTaurus)
      .attr("fill", "none")
      .attr("stroke", "url(#taurus-glow)")
      .attr("stroke-width", 2 + tidePower * 0.4)
      .style("filter", "url(#celestial-glow)")
      .attr("opacity", 0.3 + (tidePower * 0.06));

    // Dynamic moving stardust overlay path
    const moonTaurusDashed = svg.append("path")
      .attr("d", pathMoonTaurus)
      .attr("fill", "none")
      .attr("stroke", "#a1d2aa")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "6 12")
      .attr("opacity", 0.6 + (tidePower * 0.04));

    // Moon-Cancer Path
    const moonCancerLink = svg.append("path")
      .attr("d", pathMoonCancer)
      .attr("fill", "none")
      .attr("stroke", "url(#cancer-glow)")
      .attr("stroke-width", 2 + tidePower * 0.4)
      .style("filter", "url(#celestial-glow)")
      .attr("opacity", 0.3 + (tidePower * 0.06));

    const moonCancerDashed = svg.append("path")
      .attr("d", pathMoonCancer)
      .attr("fill", "none")
      .attr("stroke", "#d2bcfa")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "6 12")
      .attr("opacity", 0.6 + (tidePower * 0.04));

    // Animate dashed lines to look like flowing energy using CSS transition hacks on SVG
    let dashOffset = 0;
    const animateOffset = () => {
      dashOffset -= 1;
      moonTaurusDashed.style("stroke-dashoffset", dashOffset);
      moonCancerDashed.style("stroke-dashoffset", -dashOffset); // Flow in opposite direction
    };
    
    const d3Timer = d3.timer(animateOffset);

    // ---------------- Center Core glowing orb ----------------
    // Core synergy well
    svg.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 45)
      .attr("fill", "url(#core-glow)")
      .attr("class", "animate-pulse")
      .style("animation-duration", `${6 - tidePower * 0.3}s`);

    svg.append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", 14)
      .attr("fill", "rgba(245, 158, 11, 0.15)")
      .attr("stroke", "rgba(245, 158, 11, 0.4)")
      .attr("stroke-width", 1);

    // Heart in the core represent their unbreakable bond
    svg.append("text")
      .attr("x", centerX)
      .attr("y", centerY + 4)
      .attr("text-anchor", "middle")
      .attr("font-family", "Material Icons, sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "#fbbf24")
      .style("font-weight", "bold")
      .text("💖");

    // ---------------- Nodes: Taurus, Cancer, Moon ----------------

    // 1. TAURUS NODE (Earth)
    const taurusGroup = svg.append("g")
      .attr("transform", `translate(${taurusX}, ${taurusY})`)
      .style("cursor", "pointer")
      .on("mouseover", () => setActiveNode("taurus"))
      .on("mouseout", () => setActiveNode(null));

    // Outer Aura
    taurusGroup.append("circle")
      .attr("r", activeNode === "taurus" ? 36 : 28)
      .attr("fill", "url(#taurus-glow)")
      .attr("class", "transition-all duration-300");

    // Solid Ring
    taurusGroup.append("circle")
      .attr("r", 20)
      .attr("fill", "#18171a")
      .attr("stroke", "#a1d2aa")
      .attr("stroke-width", activeNode === "taurus" ? 2.5 : 1.5)
      .style("filter", "url(#celestial-glow)")
      .attr("class", "transition-all duration-300");

    // Symbol Icon
    taurusGroup.append("text")
      .attr("y", 6)
      .attr("text-anchor", "middle")
      .attr("fill", "#a1d2aa")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text("♉");

    // Small floating label
    taurusGroup.append("text")
      .attr("y", 34)
      .attr("text-anchor", "middle")
      .attr("fill", "#a1d2aa")
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .attr("font-size", "9px")
      .attr("letter-spacing", "1px")
      .text("TAURUS");


    // 2. CANCER NODE (Water)
    const cancerGroup = svg.append("g")
      .attr("transform", `translate(${cancerX}, ${cancerY})`)
      .style("cursor", "pointer")
      .on("mouseover", () => setActiveNode("cancer"))
      .on("mouseout", () => setActiveNode(null));

    // Outer Aura
    cancerGroup.append("circle")
      .attr("r", activeNode === "cancer" ? 36 : 28)
      .attr("fill", "url(#cancer-glow)")
      .attr("class", "transition-all duration-300");

    // Solid Ring
    cancerGroup.append("circle")
      .attr("r", 20)
      .attr("fill", "#18171a")
      .attr("stroke", "#d2bcfa")
      .attr("stroke-width", activeNode === "cancer" ? 2.5 : 1.5)
      .style("filter", "url(#celestial-glow)")
      .attr("class", "transition-all duration-300");

    // Symbol Icon
    cancerGroup.append("text")
      .attr("y", 6)
      .attr("text-anchor", "middle")
      .attr("fill", "#d2bcfa")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text("♋");

    // Small floating label
    cancerGroup.append("text")
      .attr("y", 34)
      .attr("text-anchor", "middle")
      .attr("fill", "#d2bcfa")
      .attr("font-family", "sans-serif")
      .attr("font-weight", "bold")
      .attr("font-size", "9px")
      .attr("letter-spacing", "1px")
      .text("CANCER");


    // 3. THE TRANSITING MOON NODE
    const moonGroup = svg.append("g")
      .attr("transform", `translate(${moonX}, ${moonY})`)
      .style("cursor", "pointer")
      .on("mouseover", () => setActiveNode("moon"))
      .on("mouseout", () => setActiveNode(null));

    // Moon Outer Glow
    moonGroup.append("circle")
      .attr("r", activeNode === "moon" ? 28 : 22)
      .attr("fill", "none")
      .attr("stroke", currentPhase.color)
      .attr("stroke-width", 1)
      .attr("opacity", 0.3)
      .attr("class", "transition-all duration-300");

    // Central orb representing the actual Moon phase shape
    const moonCoreColor = currentPhase.color;
    
    // Draw a small decorative orbit alignment ring
    moonGroup.append("circle")
      .attr("r", 15)
      .attr("fill", "#111012")
      .attr("stroke", moonCoreColor)
      .attr("stroke-width", 2)
      .style("filter", "url(#celestial-glow)");

    // Emoji or graphic matching moon phase
    moonGroup.append("text")
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .text(currentPhase.icon);

    // Dynamic label for the moon
    moonGroup.append("text")
      .attr("y", -22)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-family", "monospace")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .attr("letter-spacing", "0.5px")
      .text(`LUNA: ${currentPhase.name.toUpperCase()}`);

    // Clean up timer on unmount/re-render
    return () => {
      d3Timer.stop();
    };

  }, [selectedPhaseIdx, activeNode]);

  // Handle manual tab clicking
  const handlePhaseSelect = (idx: number) => {
    setIsCycling(false);
    setSelectedPhaseIdx(idx);
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Background starlight accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[90px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-4">
        <div>
          <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-secondary uppercase block mb-1">
            Astronomical Connection Engine
          </span>
          <h3 className="font-display text-2xl md:text-3xl text-on-surface font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl animate-spin" style={{ animationDuration: '10s' }}>
              orbit
            </span>
            Cosmic Synergy Graph
          </h3>
        </div>

        {/* Live cycling control */}
        <button
          onClick={() => setIsCycling(!isCycling)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
            isCycling
              ? "bg-primary text-surface border-primary shadow-[0_0_12px_rgba(210,188,250,0.4)]"
              : "bg-surface-container/40 border-white/5 text-on-surface hover:border-white/20"
          }`}
        >
          <span className="material-symbols-outlined text-sm animate-pulse">
            {isCycling ? "pause" : "play_arrow"}
          </span>
          {isCycling ? "Auto-Orbiting" : "Transit Time-Lapse"}
        </button>
      </div>

      {/* Moon phase micro-slider/selector tabs */}
      <div className="bg-surface-container-low/40 p-1.5 rounded-2xl border border-white/5 flex gap-1 overflow-x-auto scrollbar-none snap-x">
        {LUNAR_PHASES.map((phase, idx) => {
          const isSelected = selectedPhaseIdx === idx;
          return (
            <button
              key={phase.id}
              onClick={() => handlePhaseSelect(idx)}
              className={`flex-1 min-w-[76px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all snap-center cursor-pointer ${
                isSelected
                  ? "bg-surface-container-high/90 border border-primary/20 shadow-md text-primary"
                  : "text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5"
              }`}
            >
              <span className="text-xl md:text-2xl">{phase.icon}</span>
              <span className="font-sans text-[9px] font-bold tracking-wider uppercase text-center block max-w-[64px] truncate">
                {phase.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Core Layout: D3 SVG Left, Information Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* SVG Wrapper with Ref */}
        <div 
          ref={containerRef}
          className="lg:col-span-6 flex justify-center items-center bg-surface-container-lowest/20 rounded-2xl border border-white/5 py-4 relative overflow-hidden"
        >
          {/* Subtle star particle overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute top-2/3 left-3/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
            <div className="absolute top-1/2 left-2/3 w-0.5 h-0.5 bg-yellow-200 rounded-full"></div>
            <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>
          </div>

          <svg 
            ref={svgRef} 
            className="relative z-10 overflow-visible"
          />
        </div>

        {/* Correlation Insights Deck */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-4">
            
            {/* Phase Badge & Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentPhase.icon}</span>
                <div>
                  <h4 className="font-display text-xl text-on-surface font-semibold leading-none">
                    Luna in {currentPhase.name}
                  </h4>
                  <span className="font-sans text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                    {currentPhase.synergyAspect}
                  </span>
                </div>
              </div>

              {/* Dynamic Synergy Rating */}
              <div className="text-right">
                <div className="text-[10px] font-sans font-bold text-secondary uppercase tracking-widest">
                  Synergy Rating
                </div>
                <div className="font-display text-3xl font-extrabold text-transparent bg-clip-text gold-silk-gradient">
                  {currentPhase.synergyScore}%
                </div>
              </div>
            </div>

            {/* Phase Description */}
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed italic bg-surface-container/30 p-4 rounded-2xl border border-white/5">
              &quot;{currentPhase.description}&quot;
            </p>

            {/* Earth Taurus & Water Cancer dual resonance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Taurus Resonance */}
              <div className="p-4 rounded-xl border border-secondary/10 bg-secondary-container/5 space-y-1.5 hover:border-secondary/20 transition-colors">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-sm">eco</span>
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">Taurus Bedrock</span>
                </div>
                <p className="font-sans text-[12px] leading-relaxed text-on-surface-variant">
                  {currentPhase.taurusResonance}
                </p>
              </div>

              {/* Cancer Resonance */}
              <div className="p-4 rounded-xl border border-primary/10 bg-primary-container/5 space-y-1.5 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-sm">waves</span>
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">Cancer Waters</span>
                </div>
                <p className="font-sans text-[12px] leading-relaxed text-on-surface-variant">
                  {currentPhase.cancerResonance}
                </p>
              </div>

            </div>

            {/* Cosmic Tides Intensity Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-sans font-bold text-on-surface-variant uppercase tracking-wider">
                <span>Astral Tide Amplitude</span>
                <span className="text-primary font-mono">{currentPhase.tideIntensity} / 10 Intensity</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden border border-white/5 flex gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full flex-1 transition-all duration-500"
                    style={{
                      backgroundColor: i < currentPhase.tideIntensity ? currentPhase.color : "rgba(255, 255, 255, 0.05)",
                      opacity: i < currentPhase.tideIntensity ? 0.9 : 0.2
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Helpful Interactive Instructions */}
      <div className="flex items-center gap-2 bg-surface-container/20 p-3.5 rounded-xl border border-white/5 text-[11px] text-on-surface-variant leading-normal">
        <span className="material-symbols-outlined text-primary text-base animate-pulse">info</span>
        <span>
          <strong>Cosmic Harmony Note:</strong> Taurus represents structural security (Earth) and Cancer represents deep emotional fluidity (Water). During phases like the <strong>Full Moon</strong>, emotional energy peaks, requiring maximum Taurus grounding. Select moon phases to examine the celestial synergy transits.
        </span>
      </div>

    </div>
  );
}
