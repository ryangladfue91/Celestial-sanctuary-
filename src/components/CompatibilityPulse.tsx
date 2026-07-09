import React, { useState, useEffect } from "react";
import CosmicSynergyGraph from "./CosmicSynergyGraph";

interface CosmicAdviceResponse {
  advice: string;
}

export default function CompatibilityPulse({ onNavigateToTab }: { onNavigateToTab: (tab: string) => void }) {
  const [advice, setAdvice] = useState<string>("Aligning your stars to generate customized cosmic counsel...");
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(true);

  useEffect(() => {
    setLoadingAdvice(true);
    fetch("/api/cosmic-advice")
      .then((res) => res.json())
      .then((data: CosmicAdviceResponse) => {
        setAdvice(data.advice);
        setLoadingAdvice(false);
      })
      .catch((err) => {
        console.error("Failed to load advice:", err);
        setAdvice("Venus enters Taurus today, bringing a powerful current of sensory luxury. Spend time holding hands, watering household plants, or cooking with fresh rosemary.");
        setLoadingAdvice(false);
      });
  }, []);

  const handleRefreshAdvice = () => {
    setLoadingAdvice(true);
    fetch("/api/cosmic-advice")
      .then((res) => res.json())
      .then((data: CosmicAdviceResponse) => {
        setAdvice(data.advice);
        setLoadingAdvice(false);
      })
      .catch((err) => {
        console.error("Failed to refresh advice:", err);
        setLoadingAdvice(false);
      });
  };

  return (
    <div className="space-y-12 animate-fade-in duration-500">
      {/* Hero Header Section */}
      <section className="text-center space-y-3">
        <h2 className="font-display text-4xl md:text-5xl text-primary italic">
          Compatibility &amp; Synergy
        </h2>
        <p className="font-sans text-on-surface-variant text-base md:text-lg">
          The Sacred Bond of Earth and Water: Taurus &amp; Cancer
        </p>
      </section>

      {/* Astro Pairings & Pulse Score */}
      <section className="glass-card rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Taurus (Bull) */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-secondary-container/30 border border-secondary/30 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-4xl font-light">eco</span>
            </div>
            <div>
              <h3 className="font-display text-2xl text-secondary font-semibold">Taurus</h3>
              <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest font-bold mt-1">The Stable Bull</p>
            </div>
            <p className="font-sans text-sm text-on-surface-variant max-w-[200px] leading-relaxed">
              Earth element. Grounded, sensory, steadfast keeper of physical luxury.
            </p>
          </div>

          {/* Compatibility Pulse Gauge */}
          <div className="flex-grow flex flex-col items-center justify-center max-w-sm text-center py-6 border-y lg:border-y-0 lg:border-x border-outline-variant/10 px-8 relative">
            <span className="font-sans text-xs font-bold tracking-[0.25em] text-primary uppercase mb-2">
              Celestial Harmony Pulse
            </span>
            <div className="relative flex items-center justify-center">
              <span className="font-display text-7xl font-bold text-transparent bg-clip-text gold-silk-gradient tracking-tighter">
                98%
              </span>
              <div className="absolute -inset-4 border border-primary/20 rounded-full animate-ping opacity-25"></div>
            </div>
            <div className="w-full bg-surface-container-high/60 h-2.5 rounded-full mt-6 overflow-hidden border border-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-secondary to-primary" style={{ width: "98%" }}></div>
            </div>
            <p className="font-sans text-xs text-on-surface-variant italic mt-3">
              Perfect organic resonance of earth soaking up healing tides.
            </p>
          </div>

          {/* Cancer (Crab) */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-primary-container/30 border border-primary/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-4xl font-light">waves</span>
            </div>
            <div>
              <h3 className="font-display text-2xl text-primary font-semibold">Cancer</h3>
              <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest font-bold mt-1">The Intuitive Crab</p>
            </div>
            <p className="font-sans text-sm text-on-surface-variant max-w-[200px] leading-relaxed">
              Water element. Intuitive, nurturing, protective sentinel of the sanctuary.
            </p>
          </div>

        </div>

        {/* Dynamic Background Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-secondary/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
      </section>

      {/* Cosmic Synergy Graph (D3 Visual Element) */}
      <CosmicSynergyGraph />

      {/* Cosmic Counsel Box */}
      <section className="synergy-gradient rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">insights</span>
            <h4 className="font-display text-lg text-primary italic font-semibold">AI Celestial Oracle Advice</h4>
          </div>
          <button
            onClick={handleRefreshAdvice}
            disabled={loadingAdvice}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xl disabled:opacity-50"
            title="Recast cosmic advice"
          >
            sync
          </button>
        </div>

        <div className="min-h-[48px] flex items-center">
          {loadingAdvice ? (
            <div className="flex items-center gap-3 text-sm text-on-surface-variant italic font-sans animate-pulse">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              Consulting the lunar alignment...
            </div>
          ) : (
            <p className="font-sans text-sm md:text-base leading-relaxed text-on-surface italic">
              &quot;{advice}&quot;
            </p>
          )}
        </div>
      </section>

      {/* Bento Grid: Alignment Pillars */}
      <section className="space-y-6">
        <h4 className="font-display text-2xl text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">diversity_3</span>
          Pillars of Your Celestial Bond
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Emotional Connection */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-bold tracking-widest text-primary uppercase">Water Meets Earth</span>
                <span className="font-display text-xl text-primary font-bold">98%</span>
              </div>
              <h5 className="font-display text-lg text-on-surface font-semibold mb-2">Emotional Connection</h5>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Taurus provides a secure, physical container into which Cancer&apos;s emotional waters can safely flow without flooding. Taurus holds the frame, Cancer paints the watercolor.
              </p>
            </div>
            <div className="pt-2 border-t border-outline-variant/10 text-[11px] font-sans text-on-surface-variant">
              Key Focus: <span className="text-secondary">Vulnerable Listening</span>
            </div>
          </div>

          {/* Pillar 2: Stability & Growth */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-bold tracking-widest text-secondary uppercase">Durable Structure</span>
                <span className="font-display text-xl text-secondary font-bold">92%</span>
              </div>
              <h5 className="font-display text-lg text-on-surface font-semibold mb-2">Stability &amp; Growth</h5>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Cancer&apos;s profound devotion feeds Taurus&apos;s ambitious drives. Together, you construct an impregnable financial and spiritual wall that keeps outer storms from disturbing your peace.
              </p>
            </div>
            <div className="pt-2 border-t border-outline-variant/10 text-[11px] font-sans text-on-surface-variant">
              Key Focus: <span className="text-primary">Shared Assets &amp; Dreams</span>
            </div>
          </div>

          {/* Pillar 3: Shared Values */}
          <div className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs font-bold tracking-widest text-on-surface-variant uppercase">Nesting Instinct</span>
                <span className="font-display text-xl text-on-surface-variant font-bold">95%</span>
              </div>
              <h5 className="font-display text-lg text-on-surface font-semibold mb-2">Shared Domestic Values</h5>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Both signs highly prioritize the domestic nest. You share a rare understanding of what makes a house a home—sensory luxury, delicious food, safety, and deep quiet reflection.
              </p>
            </div>
            <div className="pt-2 border-t border-outline-variant/10 text-[11px] font-sans text-on-surface-variant">
              Key Focus: <span className="text-secondary">Comfort Rituals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Perform Synergy Ritual Call to Action */}
      <section className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <span className="font-sans text-xs font-bold tracking-widest text-secondary uppercase block">Ready to align your energies?</span>
          <h4 className="font-display text-xl md:text-2xl text-on-surface font-semibold">Perform Lunar Tide Emotional Clearing</h4>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            Write down your heavy burdens on the silver scroll and cast them into the lunar water. Let Taurus stability dissolve Cancer&apos;s emotional blockages.
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab("rituals")}
          className="gold-button font-sans font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-full flex-shrink-0 active:scale-95 transition-transform cursor-pointer"
        >
          Begin Ritual Space
        </button>
      </section>
    </div>
  );
}
