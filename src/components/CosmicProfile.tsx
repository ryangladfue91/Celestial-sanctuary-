import React, { useState, useEffect } from "react";
import { ProfileSettings } from "../types";

export default function CosmicProfile() {
  const [profile, setProfile] = useState<ProfileSettings>({
    meditationLength: 15,
    sensoryTriggers: ["White Sage"],
    notificationTransits: {
      moonPhases: true,
      mercuryRetrograde: false,
      sharedRituals: true
    },
    privacyLevel: "Highly Protected",
    syncDreamLogs: true,
    archiveExpiration: "After 1 Lunar Cycle"
  });

  const [newTrigger, setNewTrigger] = useState("");
  const [showDissolveConfirm, setShowDissolveConfirm] = useState(false);
  const [connectionDissolved, setConnectionDissolved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  const handleUpdateProfile = (updatedFields: Partial<ProfileSettings>) => {
    const updated = { ...profile, ...updatedFields };
    setProfile(updated);
    
    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
      .then((res) => res.json())
      .catch((err) => console.error("Error saving profile:", err));
  };

  const handleToggleNotification = (field: keyof ProfileSettings["notificationTransits"]) => {
    const updatedNotifs = {
      ...profile.notificationTransits,
      [field]: !profile.notificationTransits[field]
    };
    handleUpdateProfile({ notificationTransits: updatedNotifs });
  };

  const handleAddTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTrigger.trim() && !profile.sensoryTriggers.includes(newTrigger.trim())) {
      const updatedTriggers = [...profile.sensoryTriggers, newTrigger.trim()];
      handleUpdateProfile({ sensoryTriggers: updatedTriggers });
      setNewTrigger("");
    }
  };

  const handleRemoveTrigger = (trigger: string) => {
    const updatedTriggers = profile.sensoryTriggers.filter((t) => t !== trigger);
    handleUpdateProfile({ sensoryTriggers: updatedTriggers });
  };

  const handleDissolveConnection = () => {
    setConnectionDissolved(true);
    setShowDissolveConfirm(false);
  };

  if (connectionDissolved) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-error/10 border border-error/20 flex items-center justify-center text-error mx-auto">
          <span className="material-symbols-outlined text-4xl">broken_image</span>
        </div>
        <h3 className="font-display text-3xl text-error font-semibold italic">Connection Dissolved</h3>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
          The alignment between Taurus and Cancer has been returned to the primary void. The physical vessels are separate; the water has washed away.
        </p>
        <button
          onClick={() => {
            setConnectionDissolved(false);
            // reset profile backend
            fetch("/api/profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                meditationLength: 15,
                sensoryTriggers: ["White Sage"],
                notificationTransits: {
                  moonPhases: true,
                  mercuryRetrograde: false,
                  sharedRituals: true
                },
                privacyLevel: "Highly Protected",
                syncDreamLogs: true,
                archiveExpiration: "After 1 Lunar Cycle"
              })
            })
              .then((res) => res.json())
              .then((data) => setProfile(data));
          }}
          className="gold-button px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
          Re-Couple Altar Alignment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-fade-in duration-500">
      
      {/* 1. Couple Hero Section */}
      <section className="text-center space-y-4">
        <div className="flex items-center justify-center gap-6">
          <div className="w-16 h-16 rounded-full bg-secondary-container/20 border border-secondary/30 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-2xl font-light">eco</span>
          </div>
          <span className="material-symbols-outlined text-primary/40 text-2xl">favorite</span>
          <div className="w-16 h-16 rounded-full bg-primary-container/20 border border-primary/30 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl font-light">waves</span>
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl text-primary font-bold italic">Taurus &amp; Cancer Altar</h2>
          <p className="font-sans text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">Shared Sanctuary #5615</p>
        </div>
      </section>

      {/* 2. Altar Preferences */}
      <section className="glass-card rounded-3xl p-6 md:p-8 space-y-8 border border-white/5">
        <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-3">
          <span className="material-symbols-outlined text-primary">settings</span>
          <h3 className="font-display text-xl text-on-surface font-semibold">Our Shared Altar Config</h3>
        </div>

        <div className="space-y-6">
          {/* Daily Meditation Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-sans font-bold tracking-widest uppercase">
              <span className="text-secondary">Daily Meditation Target</span>
              <span className="text-on-surface">{profile.meditationLength} Minutes</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={profile.meditationLength}
              onChange={(e) => handleUpdateProfile({ meditationLength: parseInt(e.target.value, 10) })}
              className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="font-sans text-[11px] text-on-surface-variant italic">
              Configures the timer scale inside your Shared Ritual play hub.
            </p>
          </div>

          {/* Sensory Triggers Tags (Taurus favorite) */}
          <div className="space-y-3">
            <label className="block text-xs font-sans font-bold tracking-widest text-primary uppercase">
              Taurus Active Sensory Triggers
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.sensoryTriggers.map((trig) => (
                <span
                  key={trig}
                  className="bg-surface-container-high/60 border border-outline-variant/10 text-xs px-3 py-1 rounded-full text-on-surface flex items-center gap-1.5 font-sans"
                >
                  {trig}
                  <button
                    onClick={() => handleRemoveTrigger(trig)}
                    className="material-symbols-outlined text-[14px] text-on-surface-variant hover:text-error cursor-pointer"
                  >
                    close
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddTrigger} className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add raw scent, crystal, texture..."
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                className="flex-grow bg-surface-container/60 border border-outline-variant/20 rounded-xl px-3.5 py-1.5 font-sans text-xs text-on-surface focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-bold px-4 py-1.5 rounded-xl border border-outline-variant/20 transition-colors cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Privacy & Transit Sync toggles */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Transit Alerts toggles */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-sans text-[10px] font-bold tracking-widest text-secondary uppercase block">Communication Alerts</span>
            <h4 className="font-display text-lg text-on-surface font-semibold">Astral Sync Settings</h4>
          </div>

          <div className="space-y-3 pt-2">
            {/* Toggle Moon Phases */}
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-sans text-xs text-on-surface-variant">Moon Phase Transits</span>
              <input
                type="checkbox"
                checked={profile.notificationTransits.moonPhases}
                onChange={() => handleToggleNotification("moonPhases")}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary bg-surface-container"
              />
            </label>

            {/* Toggle Mercury Retrograde */}
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-sans text-xs text-on-surface-variant">Mercury Retrograde Warning Alerts</span>
              <input
                type="checkbox"
                checked={profile.notificationTransits.mercuryRetrograde}
                onChange={() => handleToggleNotification("mercuryRetrograde")}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary bg-surface-container"
              />
            </label>

            {/* Toggle Shared Rituals */}
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-sans text-xs text-on-surface-variant">Shared Ritual Invitations</span>
              <input
                type="checkbox"
                checked={profile.notificationTransits.sharedRituals}
                onChange={() => handleToggleNotification("sharedRituals")}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary bg-surface-container"
              />
            </label>
          </div>
        </div>

        {/* Archival Security */}
        <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-sans text-[10px] font-bold tracking-widest text-primary uppercase block">Altar Security</span>
            <h4 className="font-display text-lg text-on-surface font-semibold">Dream Logs Archiving</h4>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-on-surface-variant">Archival Expiration</span>
              <select
                value={profile.archiveExpiration}
                onChange={(e) => handleUpdateProfile({ archiveExpiration: e.target.value })}
                className="bg-surface-container-high text-on-surface text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
              >
                <option value="After 1 Lunar Cycle">After 1 Lunar Cycle</option>
                <option value="After 3 Lunar Cycles">After 3 Lunar Cycles</option>
                <option value="Permanent Anchor">Permanent Anchor</option>
              </select>
            </div>

            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-sans text-xs text-on-surface-variant">Synchronize Shared Dream logs</span>
              <input
                type="checkbox"
                checked={profile.syncDreamLogs}
                onChange={() => handleUpdateProfile({ syncDreamLogs: !profile.syncDreamLogs })}
                className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary bg-surface-container"
              />
            </label>

            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-on-surface-variant">Privacy Level</span>
              <span className="font-sans text-xs font-bold text-secondary uppercase tracking-wider">{profile.privacyLevel}</span>
            </div>
          </div>
        </div>

      </section>

      {/* 4. Danger Zone: Dissolve connection */}
      <section className="glass-card rounded-3xl p-6 border border-error/20 bg-error/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-display text-lg text-error font-semibold">Danger Zone</h4>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Dissolve the relationship alignment. This resets all shared altar preferences, logs, and notes back to the celestial void.
            </p>
          </div>

          {!showDissolveConfirm ? (
            <button
              onClick={() => setShowDissolveConfirm(true)}
              className="bg-error hover:bg-error/80 text-surface font-sans text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl cursor-pointer transition-colors"
            >
              Dissolve Connection
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setShowDissolveConfirm(false)}
                className="bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold px-4 py-2 rounded-xl border border-outline-variant/15 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDissolveConnection}
                className="bg-error hover:bg-error/90 text-surface text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl cursor-pointer"
              >
                Confirm dissolution
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
