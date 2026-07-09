import React, { useState, useEffect } from "react";
import DailyBonding from "./components/DailyBonding";
import CompatibilityPulse from "./components/CompatibilityPulse";
import CosmicCalendar from "./components/CosmicCalendar";
import RitualSpace from "./components/RitualSpace";
import DreamJournal from "./components/DreamJournal";
import CosmicProfile from "./components/CosmicProfile";
import { motion, AnimatePresence } from "motion/react";

type Tab = "sanctuary" | "bond" | "calendar" | "rituals" | "journal" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("sanctuary");
  const [utcTime, setUtcTime] = useState("");

  // Live real-time UTC clock for celestial tracking
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toUTCString().replace("GMT", "UTC");
      setUtcTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "sanctuary":
        return <DailyBonding onNavigateToTab={(tab) => setActiveTab(tab as Tab)} />;
      case "bond":
        return <CompatibilityPulse onNavigateToTab={(tab) => setActiveTab(tab as Tab)} />;
      case "calendar":
        return <CosmicCalendar onNavigateToTab={(tab) => setActiveTab(tab as Tab)} />;
      case "rituals":
        return <RitualSpace />;
      case "journal":
        return <DreamJournal onNavigateToTab={(tab) => setActiveTab(tab as Tab)} />;
      case "profile":
        return <CosmicProfile />;
      default:
        return <DailyBonding onNavigateToTab={(tab) => setActiveTab(tab as Tab)} />;
    }
  };

  const navItems = [
    { id: "sanctuary", label: "Sanctuary", icon: "home" },
    { id: "bond", label: "Bond Harmony", icon: "favorite" },
    { id: "calendar", label: "Cosmic Calendar", icon: "auto_awesome" },
    { id: "rituals", label: "Shared Rituals", icon: "water_drop" },
    { id: "journal", label: "Dream Journal", icon: "history_edu" },
    { id: "profile", label: "Cosmic Profile", icon: "settings" }
  ];

  return (
    <div className="relative min-h-screen pb-24">
      {/* Mystical backgrounds */}
      <div className="starry-bg"></div>
      <div className="star-field"></div>
      
      {/* Dual Cosmic Glow Aura blobs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 z-0"></div>

      {/* Main Top Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between border-b border-outline-variant/5">
        <div className="text-center md:text-left">
          <h1 className="font-display text-2xl md:text-3xl text-on-surface tracking-[0.05em] font-medium flex items-center justify-center md:justify-start gap-2.5">
            <span className="material-symbols-outlined text-primary text-2xl animate-pulse">
              explore
            </span>
            CELESTIAL SANCTUARY
          </h1>
          <p className="font-sans text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.25em] mt-1.5">
            Synchronized Taurus &amp; Cancer Sanctuary
          </p>
        </div>

        {/* Live Clock / Astral indicators */}
        <div className="mt-4 md:mt-0 flex items-center gap-4 bg-surface-container/30 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-secondary text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-sans uppercase tracking-widest font-bold text-[9px]">AURA ACTIVE</span>
          </div>
          <span className="h-4 w-[1px] bg-outline-variant/25"></span>
          <span className="font-mono text-xs text-on-surface-variant/80 tracking-wide">
            {utcTime || "Synchronizing Transits..."}
          </span>
        </div>
      </header>

      {/* Master Content Stage */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Bottom Floating Navigation Bar */}
      <nav className="fixed bottom-6 inset-x-0 mx-auto max-w-lg md:max-w-xl z-50 px-4">
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-full py-2.5 px-4 md:px-6 flex justify-between items-center border border-primary/10 shadow-[0_10px_35px_rgba(20,19,22,0.6)]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className="relative flex flex-col items-center justify-center group flex-1 cursor-pointer"
              >
                {/* Visual Glow Circle behind active icon */}
                {isActive && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute -inset-1.5 rounded-full bg-primary/10 blur-sm -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <span
                  className={`material-symbols-outlined text-2xl transition-all duration-300 ${
                    isActive
                      ? "text-primary scale-110 font-semibold"
                      : "text-on-surface-variant hover:text-on-surface hover:scale-105"
                  }`}
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
                  }}
                >
                  {item.icon}
                </span>

                <span
                  className={`text-[9px] font-sans font-bold uppercase tracking-wider mt-1 transition-all duration-300 ${
                    isActive ? "text-on-surface opacity-100" : "text-on-surface-variant/40 group-hover:text-on-surface-variant opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {item.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
