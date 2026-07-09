import React, { useState, useEffect } from "react";
import { WeeklyChallenge } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface DailyBondingProps {
  onNavigateToTab: (tab: string) => void;
}

export default function DailyBonding({ onNavigateToTab }: DailyBondingProps) {
  const [challenge, setChallenge] = useState<WeeklyChallenge>({
    accepted: false,
    title: "Altar of Shared Dreams",
    description: "Combine Taurus's physical manifestation with Cancer's visionary intuition. This week, find a physical object that represents a goal you share, and place it in a prominent spot in your home. Every time you pass it, whisper one word of encouragement to your partner."
  });
  
  const [chosenPath, setChosenPath] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/challenge")
      .then((res) => res.json())
      .then((data) => setChallenge(data))
      .catch((err) => console.error("Error loading challenge:", err));
  }, []);

  const handleAcceptChallenge = () => {
    const action = challenge.accepted ? "reset" : "accept";
    fetch(`/api/challenge/${action}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setChallenge(data))
      .catch((err) => console.error("Error updating challenge:", err));
  };

  const handleChoosePath = (path: string) => {
    setChosenPath(path);
    setTimeout(() => {
      setChosenPath(null);
    }, 3000);
  };

  return (
    <div className="space-y-12 animate-fade-in duration-500">
      {/* Header Section */}
      <section className="text-center">
        <h2 className="font-display text-4xl md:text-5xl text-primary mb-3 italic">
          Daily Bonding Suggestions
        </h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto font-sans text-base italic md:text-lg">
          Nurturing the roots of Taurus and the tides of Cancer into a unified sanctuary.
        </p>
      </section>

      {/* 1. Shared Sanctuary (Co-operative Tasks) */}
      <section id="shared-sanctuary">
        <div className="flex items-center justify-between mb-6 border-b border-outline-variant/10 pb-4">
          <h3 className="font-display text-2xl md:text-3xl text-secondary flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">favorite</span>
            Shared Sanctuary
          </h3>
          <span className="font-sans text-xs font-bold tracking-widest text-on-surface-variant uppercase">
            Rituals for Two
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Taurus Herb Garden */}
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 relative group">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                alt="Plant an Herb Garden"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw0UsUVhspo_ovdsT3tzw_mL-Mvhq5xvYOsNL-tJrRqyDSxEwvvXSXez1OXyuJ45UcP6qNIv6W2t1tW7wzsSRHHoS3V5KfsFxsQueUd9VGcYAF1EVp7WgFg1yxZe42okVwMT7fWjKzdkQdnNMmCGP8FdbL3UwO63IxjhSkgx2tcJOTXunQqarbrXc1S2ya_IgTezcWvjWCoOU9y-qAP7LUamolCThYX3nwgTv72jRaXA7d9BLa6z4ccCVlOEALgdqrvvxd4YxEJra1"
              />
            </div>
            <div className="flex-grow flex flex-col justify-between h-full">
              <div>
                <span className="font-sans text-[10px] text-secondary border border-secondary/30 px-2.5 py-0.5 rounded-full mb-3 inline-block uppercase font-bold tracking-wider">
                  Earth Element Ritual
                </span>
                <h4 className="font-display text-xl text-on-surface mb-2">
                  Plant an Herb Garden
                </h4>
                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                  Ground your energy by nurturing life together. Use your hands to feel the soil and select scents that soothe your combined space.
                </p>
              </div>
              <button
                id="choose-herb-path"
                onClick={() => handleChoosePath("herb")}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  chosenPath === "herb"
                    ? "bg-secondary text-surface shadow-[0_0_15px_rgba(161,210,170,0.5)] scale-95"
                    : "gold-button cursor-pointer"
                }`}
              >
                {chosenPath === "herb" ? "Path Chosen ✓" : "Choose this path"}
              </button>
            </div>
          </div>

          {/* Cancer Playlist */}
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 relative group">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                alt="Create a Shared Playlist"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHkporE0VitYQ3-gEGzCMMtk6jfN8INbn4QIhcLMXcjFwdZehspVITnEtpPQr5RE0Bn7dLRZFZ_Z3KQo81B_aQCNvtJ0vbgsmEs6YYpGaJoOAH1sRQGqMqmxTNBIXXOqXoLmaNY_Xd3PFJ8XdnsTb1_rvDvm6zPEuOOt8pEAKZZL4Z6-q4FGY0LXSB3zWEWsbU1Qp2YLk2x76z-62qGOAt163ZHkt294cQawz9FYxTKsrXSY_P2IJKBuUjBfV7asDH-l7QoFfQzQjZ"
              />
            </div>
            <div className="flex-grow flex flex-col justify-between h-full">
              <div>
                <span className="font-sans text-[10px] text-primary border border-primary/30 px-2.5 py-0.5 rounded-full mb-3 inline-block uppercase font-bold tracking-wider">
                  Water Element Ritual
                </span>
                <h4 className="font-display text-xl text-on-surface mb-2">
                  Create a Shared Playlist
                </h4>
                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                  Communicate through the language of sound. Curate a collection of melodies that reflect your shared history and future dreams.
                </p>
              </div>
              <button
                id="choose-playlist-path"
                onClick={() => handleChoosePath("playlist")}
                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  chosenPath === "playlist"
                    ? "bg-primary text-surface shadow-[0_0_15px_rgba(210,188,250,0.5)] scale-95"
                    : "gold-button cursor-pointer"
                }`}
              >
                {chosenPath === "playlist" ? "Path Chosen ✓" : "Choose this path"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Individual Growth (Solo Paths) */}
      <section id="individual-growth">
        <div className="flex items-center justify-between mb-6 border-b border-outline-variant/10 pb-4">
          <h3 className="font-display text-2xl md:text-3xl text-on-surface-variant flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">center_focus_strong</span>
            Individual Growth
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Taurus Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 py-2 border-b-2 border-secondary/50 mb-2">
              <span className="material-symbols-outlined text-secondary">eco</span>
              <h4 className="font-sans font-semibold text-secondary text-base">Taurus: Grounded Strength</h4>
            </div>

            <div className="glass-card p-5 rounded-xl border-l-4 border-secondary space-y-3">
              <h5 className="font-sans font-bold text-on-surface text-base">Sensory Sanctuary Audit</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Identify three textures or scents in your home that bring you immediate peace. Focus on tactile quality.
              </p>
              <div className="flex items-center gap-2 text-secondary/70 text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="uppercase tracking-widest font-sans">15 Minutes</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-xl border-l-4 border-secondary/60 opacity-80 hover:opacity-100 transition-opacity space-y-3">
              <h5 className="font-sans font-bold text-on-surface text-base">Financial Oracle Review</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Check your savings path. Stability is your foundation for emotional safety.
              </p>
              <div className="flex items-center gap-2 text-secondary/70 text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">payments</span>
                <span className="uppercase tracking-widest font-sans">10 Minutes</span>
              </div>
            </div>
          </div>

          {/* Cancer Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 py-2 border-b-2 border-primary/50 mb-2">
              <span className="material-symbols-outlined text-primary">waves</span>
              <h4 className="font-sans font-semibold text-primary text-base">Cancer: Intuitive Flow</h4>
            </div>

            <div className="glass-card p-5 rounded-xl border-l-4 border-primary space-y-3">
              <h5 className="font-sans font-bold text-on-surface text-base">Emotional Reflection Ritual</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Free-write for five minutes about your current internal tide. Is the water calm or rising?
              </p>
              <div className="flex items-center gap-2 text-primary/70 text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">history_edu</span>
                <span className="uppercase tracking-widest font-sans">5 Minutes</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-xl border-l-4 border-primary/60 opacity-80 hover:opacity-100 transition-opacity space-y-3">
              <h5 className="font-sans font-bold text-on-surface text-base">Sacred Space Nurturing</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Rearrange one corner of your home to feel more &quot;protected&quot; and soft.
              </p>
              <div className="flex items-center gap-2 text-primary/70 text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">home</span>
                <span className="uppercase tracking-widest font-sans">20 Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Synergy Challenge */}
      <section id="synergy-challenge">
        <div className="synergy-gradient rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-surface/50 backdrop-blur-md rounded-full flex items-center justify-center border border-outline-variant/30 animate-float">
              <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <span className="font-sans text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2 block">
                Weekly Celestial Bond
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-on-surface mb-3">
                The Synergy Challenge: {challenge.title}
              </h3>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
                {challenge.description}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button
                  id="accept-challenge-btn"
                  onClick={handleAcceptChallenge}
                  className={`py-3 px-8 rounded-full text-sm font-bold active:scale-95 transition-all cursor-pointer ${
                    challenge.accepted 
                      ? "bg-secondary text-surface border border-secondary shadow-[0_0_15px_rgba(161,210,170,0.4)]"
                      : "gold-button"
                  }`}
                >
                  {challenge.accepted ? "Challenge Active ✓" : "Accept Challenge"}
                </button>
                <button
                  id="learn-more-challenge-btn"
                  onClick={() => onNavigateToTab("bond")}
                  className="bg-surface-container-high/50 hover:bg-surface-container-high text-on-surface text-sm font-semibold py-3 px-8 rounded-full border border-outline-variant/20 transition-colors cursor-pointer"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
