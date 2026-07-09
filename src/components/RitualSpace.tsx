import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PlayableMeditation {
  id: string;
  title: string;
  duration: string;
  type: string;
  icon: string;
}

export default function RitualSpace() {
  const [burdens, setBurdens] = useState<string[]>([]);
  const [newBurden, setNewBurden] = useState("");
  const [loadingBurdens, setLoadingBurdens] = useState(true);

  // Audio Player State
  const [activeAudio, setActiveAudio] = useState<PlayableMeditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const meditations: PlayableMeditation[] = [
    { id: "med-1", title: "Deep Roots Meditation", duration: "15:00", type: "TAURUS EARTH", icon: "eco" },
    { id: "med-2", title: "Sensory Gratitude Chant", duration: "10:00", type: "TAURUS SENSORY", icon: "music_note" },
    { id: "med-3", title: "Luna Reflection Chant", duration: "12:00", type: "CANCER WATER", icon: "water_drop" }
  ];

  useEffect(() => {
    fetchBurdens();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeAudio) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          const maxSec = parseDurationToSeconds(activeAudio.duration);
          if (prev >= maxSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeAudio]);

  const fetchBurdens = () => {
    setLoadingBurdens(true);
    fetch("/api/burdens")
      .then((res) => res.json())
      .then((data) => {
        setBurdens(data);
        setLoadingBurdens(false);
      })
      .catch((err) => {
        console.error("Error loading burdens:", err);
        setBurdens(["Old doubts", "Morning anxiety", "Past regrets"]);
        setLoadingBurdens(false);
      });
  };

  const handleAddBurden = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBurden.trim()) return;

    fetch("/api/burdens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ burden: newBurden })
    })
      .then((res) => res.json())
      .then((data) => {
        setBurdens(data);
        setNewBurden("");
      })
      .catch((err) => console.error("Error saving burden:", err));
  };

  const handleClearBurden = (index: number) => {
    fetch(`/api/burdens/${index}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        setBurdens(data);
      })
      .catch((err) => console.error("Error clearing burden:", err));
  };

  const handlePlayToggle = (med: PlayableMeditation) => {
    if (activeAudio?.id === med.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveAudio(med);
      setIsPlaying(true);
      setPlaybackTime(0);
    }
  };

  const parseDurationToSeconds = (durationStr: string): number => {
    const parts = durationStr.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const formatPlaybackTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-12 animate-fade-in duration-500">
      {/* Header Banner: Transit Alert */}
      <section className="synergy-gradient border border-secondary/30 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary animate-pulse text-2xl">
            error_med
          </span>
          <div>
            <span className="font-sans text-[10px] font-bold text-secondary tracking-widest uppercase">Active Celestial Transit Alert</span>
            <p className="font-sans text-xs md:text-sm text-on-surface font-medium">
              Venus enters Taurus. This transit boosts stability, touch, and physical manifestation. Enjoy comfort-first shared routines.
            </p>
          </div>
        </div>
        <span className="font-sans text-[10px] text-secondary font-bold border border-secondary/30 px-3 py-1 rounded-full uppercase flex-shrink-0">
          Very Auspicious
        </span>
      </section>

      {/* Hero Title */}
      <section className="text-center">
        <h2 className="font-display text-4xl md:text-5xl text-primary mb-3 italic">
          Shared Ritual Space
        </h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto font-sans text-base italic md:text-lg">
          Sync your physical steps (Taurus) and emotional tides (Cancer) into sacred harmony.
        </p>
      </section>

      {/* Main Grid split: Audio Meditations vs Emotional Clearing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Meditations & Sound Chants */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
            <span className="material-symbols-outlined text-secondary text-2xl">music_note</span>
            <h3 className="font-display text-2xl text-on-surface font-medium">Daily Alignments</h3>
          </div>

          <div className="space-y-4">
            {meditations.map((med) => {
              const isActive = activeAudio?.id === med.id;
              const isThisPlaying = isActive && isPlaying;
              
              return (
                <div
                  key={med.id}
                  className={`glass-card rounded-2xl p-5 flex items-center justify-between transition-all duration-300 ${
                    isActive ? "border-primary/40 bg-primary-container/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePlayToggle(med)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isThisPlaying ? "bg-primary text-surface scale-95" : "bg-surface-container hover:bg-surface-container-high text-primary"
                      } cursor-pointer`}
                    >
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isThisPlaying ? "pause" : "play_arrow"}
                      </span>
                    </button>
                    <div>
                      <span className="font-sans text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
                        {med.type}
                      </span>
                      <h4 className="font-display text-lg text-on-surface font-medium mt-0.5">{med.title}</h4>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs text-on-surface-variant font-medium tracking-wide block">
                      {isActive ? formatPlaybackTime(playbackTime) : med.duration}
                    </span>
                    <span className="font-sans text-[9px] text-secondary/70 tracking-widest uppercase font-bold">
                      {isActive ? "ACTIVE" : "READY"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Audio Player Hub */}
          {activeAudio && (
            <div className="glass-card rounded-3xl p-6 border border-primary/20 bg-surface-container-lowest/50 backdrop-blur-xl relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 left-0 w-full h-1 bg-surface-container-high">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{
                    width: `${(playbackTime / parseDurationToSeconds(activeAudio.duration)) * 100}%`
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary animate-float">
                    <span className="material-symbols-outlined text-xl">{activeAudio.icon}</span>
                  </div>
                  <div>
                    <h5 className="font-sans font-bold text-sm text-on-surface">{activeAudio.title}</h5>
                    <p className="font-sans text-xs text-on-surface-variant italic">Playing shared sanctuary audio...</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPlaybackTime(Math.max(0, playbackTime - 10))}
                    className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer text-xl"
                  >
                    replay_10
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="material-symbols-outlined text-primary hover:text-on-surface cursor-pointer text-2xl"
                  >
                    {isPlaying ? "pause_circle" : "play_circle"}
                  </button>
                  <button
                    onClick={() => setPlaybackTime(Math.min(parseDurationToSeconds(activeAudio.duration), playbackTime + 10))}
                    className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer text-xl"
                  >
                    forward_10
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 2. Lunar Tide Emotional Clearing */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/10 pb-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">waves</span>
              <h3 className="font-display text-2xl text-on-surface font-medium">Lunar Tide Emotional Clearing</h3>
            </div>
            <span className="font-sans text-xs font-bold tracking-widest text-on-surface-variant uppercase">
              Water Basin
            </span>
          </div>

          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            Write down your heavy burdens, anxieties, or past regrets on the water scroll below, then tap the wave button to dissolve them into the pure, restorative Lunar basin.
          </p>

          {/* Sacred Basin UI Container */}
          <div className="glass-card rounded-3xl p-6 border border-primary/10 relative overflow-hidden bg-gradient-to-b from-surface-container-low to-primary-container/10 min-h-[250px] flex flex-col justify-between">
            
            {/* Water Ripple Layer */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-primary/5 rounded-b-3xl pointer-events-none flex items-end justify-center overflow-hidden">
              <div className="w-[120%] h-12 bg-primary/10 rounded-[40%] translate-y-6 animate-pulse"></div>
            </div>

            {/* List of active burdens */}
            <div className="space-y-3 z-10">
              {loadingBurdens ? (
                <div className="text-center font-sans text-xs text-on-surface-variant italic py-8 animate-pulse flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                  Purifying pool waters...
                </div>
              ) : burdens.length === 0 ? (
                <div className="text-center font-sans text-sm text-secondary/70 italic py-10 flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-3xl mb-1">sentiment_satisfied_alt</span>
                  All emotional tides are clear. Your home basin is pure and unburdened.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  <AnimatePresence>
                    {burdens.map((burden, index) => (
                      <motion.div
                        key={`${burden}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        className="glass-card bg-surface-container-high/40 hover:bg-surface-container-high/70 p-3.5 rounded-xl flex items-center justify-between border border-primary/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          <span className="font-sans text-sm text-on-surface italic">{burden}</span>
                        </div>
                        <button
                          onClick={() => handleClearBurden(index)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-error text-xl transition-colors cursor-pointer"
                          title="Dissolve into water"
                        >
                          waves
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Burden input form */}
            <form onSubmit={handleAddBurden} className="mt-6 flex gap-2 z-10 relative">
              <input
                type="text"
                required
                placeholder="Cast a burden into the scroll..."
                value={newBurden}
                onChange={(e) => setNewBurden(e.target.value)}
                className="flex-grow bg-surface-container/60 border border-outline-variant/20 rounded-xl px-4 py-2.5 font-sans text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="gold-button w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
                title="Write onto scroll"
              >
                <span className="material-symbols-outlined text-surface text-xl">history_edu</span>
              </button>
            </form>

            {/* Glowing lunar crescent in background */}
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-primary/20 opacity-30 pointer-events-none flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">brightness_2</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
