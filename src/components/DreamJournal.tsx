import React, { useState, useEffect } from "react";
import { Dream, Note } from "../types";
import { motion, AnimatePresence } from "motion/react";
import AffectionAltar from "./AffectionAltar";

interface DreamJournalProps {
  onNavigateToTab: (tab: string) => void;
}

export default function DreamJournal({ onNavigateToTab }: DreamJournalProps) {
  const [subTab, setSubTab] = useState<"logs" | "notes" | "affection">("logs");
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteSender, setNewNoteSender] = useState<"Taurus" | "Cancer">("Taurus");
  const [newNoteType, setNewNoteType] = useState<"SUGGESTION" | "QUESTION" | "REFLECTION">("SUGGESTION");

  // Record Dream State
  const [showAddDreamModal, setShowAddDreamModal] = useState(false);
  const [dreamTitle, setDreamTitle] = useState("");
  const [dreamNarrative, setDreamNarrative] = useState("");
  const [selectedSensoryAnchors, setSelectedSensoryAnchors] = useState<string[]>([]);
  const [selectedEmotionalEchoes, setSelectedEmotionalEchoes] = useState<string[]>([]);
  const [synergyChoice, setSynergyChoice] = useState<"Solo Journey" | "Two-Heart Resonance">("Solo Journey");
  
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretationResult, setInterpretationResult] = useState<any | null>(null);

  const taurusSensoryOptions = [
    "Emerald Moss on Wet Stones",
    "Fresh Ground Ginger & Cardamom",
    "Suede Velvet Blanket Touch",
    "Warm Pine & Sandalwood Bark"
  ];

  const cancerEmotionalOptions = [
    "Tidal Nostalgia of First Meeting",
    "Quiet Restorative Solitude",
    "Deep Protective Instincts",
    "Unspoken Compassionate Union"
  ];

  useEffect(() => {
    fetchDreams();
    fetchNotes();
  }, []);

  const fetchDreams = () => {
    fetch("/api/dreams")
      .then((res) => res.json())
      .then((data) => {
        setDreams(data);
        if (data.length > 0 && !selectedDream) {
          setSelectedDream(data[0]);
        }
      })
      .catch((err) => console.error("Error loading dreams:", err));
  };

  const fetchNotes = () => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error loading notes:", err));
  };

  // Add Note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: newNoteSender,
        type: newNoteType,
        text: newNoteText
      })
    })
      .then((res) => res.json())
      .then(() => {
        setNewNoteText("");
        fetchNotes();
      })
      .catch((err) => console.error("Error adding note:", err));
  };

  const handleDeleteNote = (id: string) => {
    fetch(`/api/notes/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchNotes())
      .catch((err) => console.error("Error deleting note:", err));
  };

  // Toggle Sensory/Emotional Tag in Add Dream
  const toggleSensoryOption = (opt: string) => {
    if (selectedSensoryAnchors.includes(opt)) {
      setSelectedSensoryAnchors(selectedSensoryAnchors.filter((o) => o !== opt));
    } else {
      setSelectedSensoryAnchors([...selectedSensoryAnchors, opt]);
    }
  };

  const toggleEmotionalOption = (opt: string) => {
    if (selectedEmotionalEchoes.includes(opt)) {
      setSelectedEmotionalEchoes(selectedEmotionalEchoes.filter((o) => o !== opt));
    } else {
      setSelectedEmotionalEchoes([...selectedEmotionalEchoes, opt]);
    }
  };

  // Call Gemini to Interpret Dream
  const handleInterpretDream = () => {
    if (!dreamNarrative.trim()) return;
    setIsInterpreting(true);

    fetch("/api/interpret-dream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: dreamNarrative,
        sensoryAnchors: selectedSensoryAnchors,
        emotionalEchoes: selectedEmotionalEchoes,
        synergy: synergyChoice
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setInterpretationResult(data);
        setIsInterpreting(false);
      })
      .catch((err) => {
        console.error("Gemini interpretation failed:", err);
        setIsInterpreting(false);
      });
  };

  // Confirm Interpretation and Save to list
  const handleSaveDream = () => {
    if (!interpretationResult) return;

    const payload = {
      title: dreamTitle || interpretationResult.title || "Shared Altar Vision",
      narrative: dreamNarrative,
      tags: [synergyChoice, ...selectedSensoryAnchors.map(s => s.split(" ")[0]), ...selectedEmotionalEchoes.map(e => e.split(" ")[0])].slice(0, 3),
      image: interpretationResult.image, // Could be returned by fallback or base64 generated
      harmony: interpretationResult.harmony,
      earthlyGrounding: interpretationResult.earthlyGrounding,
      emotionalTides: interpretationResult.emotionalTides,
      synthesis: interpretationResult.synthesis
    };

    fetch("/api/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((newD) => {
        setDreams([newD, ...dreams]);
        setSelectedDream(newD);
        setShowAddDreamModal(false);
        // Reset states
        setDreamTitle("");
        setDreamNarrative("");
        setSelectedSensoryAnchors([]);
        setSelectedEmotionalEchoes([]);
        setInterpretationResult(null);
      })
      .catch((err) => console.error("Error saving dream:", err));
  };

  return (
    <div className="space-y-8 animate-fade-in duration-500">
      
      {/* Upper Navigation Toggle */}
      <div className="flex justify-center">
        <div className="bg-surface-container/60 p-1 rounded-full flex border border-outline-variant/10 max-w-full overflow-x-auto">
          <button
            onClick={() => setSubTab("logs")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
              subTab === "logs" ? "bg-primary text-surface shadow-[0_4px_10px_rgba(210,188,250,0.2)]" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Dream Logs
          </button>
          <button
            onClick={() => setSubTab("notes")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
              subTab === "notes" ? "bg-primary text-surface shadow-[0_4px_10px_rgba(210,188,250,0.2)]" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Celestial Notes
          </button>
          <button
            onClick={() => setSubTab("affection")}
            className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[11px] md:text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              subTab === "affection" ? "bg-primary text-surface shadow-[0_4px_10px_rgba(210,188,250,0.2)]" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
            Affection Altar
          </button>
        </div>
      </div>

      {subTab === "logs" && (
        // ----------------- DREAM JOURNAL VIEW -----------------
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Dream Entries List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl text-on-surface font-semibold">Dream Logs</h3>
              <span className="font-mono text-xs text-on-surface-variant">{dreams.length} Archival Visions</span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {dreams.map((dream) => {
                const isSelected = selectedDream?.id === dream.id;
                return (
                  <div
                    key={dream.id}
                    onClick={() => setSelectedDream(dream)}
                    className={`glass-card p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected 
                        ? "border-primary/50 bg-primary-container/10 translate-x-1" 
                        : "border-white/5 bg-surface-container-low/40 hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[10px] text-on-surface-variant font-bold">{dream.date}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                          <span className="font-sans text-[9px] text-secondary font-bold tracking-wider uppercase">{dream.tags[0] || "Dream"}</span>
                        </div>
                        <h4 className="font-display text-lg text-on-surface font-semibold mt-1 line-clamp-1">{dream.title}</h4>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-surface-container-high/60 flex items-center justify-center font-display text-primary font-bold text-lg border border-primary/10">
                        {dream.harmony}%
                      </div>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant mt-2 line-clamp-2 italic leading-relaxed">
                      &quot;{dream.narrative}&quot;
                    </p>
                  </div>
                );
              })}
              {dreams.length === 0 && (
                <div className="text-center py-12 text-on-surface-variant italic font-sans text-sm">
                  The dream altar is still. Tap the floating button below to log your first vision.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Complete Dream Interpretation Detail */}
          <div className="lg:col-span-7">
            {selectedDream ? (
              <div className="glass-card rounded-3xl overflow-hidden border border-white/5 bg-surface-container-lowest/40 shadow-2xl space-y-6">
                
                {/* Hero Banner with hotlink image */}
                <div className="h-56 relative w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10"></div>
                  <img
                    className="w-full h-full object-cover transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                    alt={selectedDream.title}
                    src={selectedDream.image}
                  />
                  
                  {/* Harmony badge */}
                  <div className="absolute top-4 right-4 z-20 glass-card px-4 py-2 rounded-2xl border border-primary/30 flex items-center gap-2 bg-surface-container-lowest/80">
                    <span className="material-symbols-outlined text-primary text-sm animate-pulse">favorite</span>
                    <span className="font-sans text-xs font-bold tracking-widest text-primary uppercase">HARMONY</span>
                    <span className="font-display text-lg text-on-surface font-bold">{selectedDream.harmony}%</span>
                  </div>

                  <div className="absolute bottom-4 left-6 z-20">
                    <span className="font-sans text-xs font-bold text-secondary uppercase tracking-widest block mb-1">
                      {selectedDream.tags.join(" • ")}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-on-surface italic font-bold">
                      {selectedDream.title}
                    </h3>
                  </div>
                </div>

                {/* Subconscious Narrative Panel */}
                <div className="px-6 md:px-8 space-y-6 pb-8">
                  <div>
                    <span className="font-sans text-[10px] text-on-surface-variant font-bold tracking-widest uppercase block mb-2">Narrative Recollection</span>
                    <p className="font-sans text-sm text-on-surface-variant italic leading-relaxed bg-surface-container-low/40 p-4 rounded-2xl border border-white/5">
                      &quot;{selectedDream.narrative}&quot;
                    </p>
                  </div>

                  {/* Dual Interpretation Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/10">
                    {/* Taurus: Earthly Grounding */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-secondary/20 pb-2">
                        <span className="material-symbols-outlined text-secondary text-lg">eco</span>
                        <h4 className="font-sans font-bold text-secondary text-sm uppercase tracking-wider">Taurus: Earthly Grounding</h4>
                      </div>
                      <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                        {selectedDream.earthlyGrounding.description}
                      </p>
                      <div className="bg-surface-container-high/40 p-3 rounded-xl space-y-1">
                        <span className="font-sans text-[9px] font-bold text-secondary/70 uppercase tracking-widest block">Anchor Symbol</span>
                        <span className="font-sans text-xs text-on-surface font-medium">{selectedDream.earthlyGrounding.symbol}</span>
                      </div>
                      <div className="bg-secondary-container/10 border border-secondary/20 p-3 rounded-xl space-y-1">
                        <span className="font-sans text-[9px] font-bold text-secondary uppercase tracking-widest block">Manifestation Action</span>
                        <span className="font-sans text-xs text-on-surface italic">{selectedDream.earthlyGrounding.action}</span>
                      </div>
                    </div>

                    {/* Cancer: Emotional Tides */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                        <span className="material-symbols-outlined text-primary text-lg">waves</span>
                        <h4 className="font-sans font-bold text-primary text-sm uppercase tracking-wider">Cancer: Emotional Tides</h4>
                      </div>
                      <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                        {selectedDream.emotionalTides.description}
                      </p>
                      <div className="bg-surface-container-high/40 p-3 rounded-xl space-y-1">
                        <span className="font-sans text-[9px] font-bold text-primary/70 uppercase tracking-widest block">Subconscious feeling</span>
                        <span className="font-sans text-xs text-on-surface font-medium">{selectedDream.emotionalTides.feeling}</span>
                      </div>
                      <div className="bg-primary-container/10 border border-primary/20 p-3 rounded-xl space-y-1">
                        <span className="font-sans text-[9px] font-bold text-primary uppercase tracking-widest block">Intuitive Guidance</span>
                        <span className="font-sans text-xs text-on-surface italic">{selectedDream.emotionalTides.intuition}</span>
                      </div>
                    </div>
                  </div>

                  {/* Core Synthesis Area */}
                  <div className="pt-6 border-t border-outline-variant/10 space-y-2">
                    <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider block">Unified Celestial Altar Synthesis</span>
                    <p className="font-sans text-sm text-on-surface leading-relaxed italic bg-gradient-to-r from-secondary-container/10 to-primary-container/10 p-5 rounded-2xl border border-primary/15">
                      {selectedDream.synthesis}
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-card rounded-3xl p-12 text-center text-on-surface-variant italic font-sans text-base">
                No vision selected. Select a log on the left or record a new dream.
              </div>
            )}
          </div>

        </div>
      )}

      {subTab === "notes" && (
        // ----------------- CELESTIAL NOTES / CHAT -----------------
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-display text-2xl text-on-surface font-semibold">Celestial Notes</h3>
            <span className="font-sans text-xs text-on-surface-variant italic">Securely synchronized couple thread</span>
          </div>

          {/* Notes Container */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 bg-surface-container-lowest/30 shadow-xl space-y-4 max-h-[500px] overflow-y-auto">
            {notes.map((note) => {
              const isTaurus = note.sender === "Taurus";
              const isCancer = note.sender === "Cancer";
              const isShared = note.sender === "Shared Vision";

              let senderColor = "text-secondary";
              let cardBg = "bg-secondary-container/5 border-secondary/15";
              if (isCancer) {
                senderColor = "text-primary";
                cardBg = "bg-primary-container/5 border-primary/15";
              } else if (isShared) {
                senderColor = "text-on-surface-variant";
                cardBg = "bg-surface-container-high/40 border-outline-variant/10";
              }

              return (
                <div
                  key={note.id}
                  className={`border p-4 rounded-2xl flex flex-col justify-between gap-2 relative group transition-all ${cardBg}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className={`font-sans text-xs font-bold uppercase tracking-wider ${senderColor}`}>
                        {note.sender}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      <span className="font-sans text-[10px] text-secondary border border-secondary/20 px-2 py-0.5 rounded-md font-bold tracking-widest uppercase">
                        {note.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[10px] text-on-surface-variant">{note.time}</span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="material-symbols-outlined text-on-surface-variant hover:text-error text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Delete note"
                      >
                        delete
                      </button>
                    </div>
                  </div>

                  <p className="font-sans text-sm text-on-surface mt-1 leading-relaxed">
                    {note.text}
                  </p>
                </div>
              );
            })}

            {notes.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant italic font-sans text-sm">
                The communication channels are silent. Cast the first seed note below.
              </div>
            )}
          </div>

          {/* New Note Form */}
          <form onSubmit={handleAddNote} className="glass-card rounded-2xl p-4 border border-white/5 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-on-surface-variant font-bold">Sender:</span>
                <select
                  value={newNoteSender}
                  onChange={(e) => setNewNoteSender(e.target.value as any)}
                  className="bg-surface-container-high text-on-surface text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
                >
                  <option value="Taurus">Taurus (Earth)</option>
                  <option value="Cancer">Cancer (Water)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-on-surface-variant font-bold">Category:</span>
                <select
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value as any)}
                  className="bg-surface-container-high text-on-surface text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20"
                >
                  <option value="SUGGESTION">Suggestion 🌿</option>
                  <option value="QUESTION">Question ✨</option>
                  <option value="REFLECTION">Reflection 🕊️</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Type your intimate note or shared guidance..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-grow bg-surface-container/60 border border-outline-variant/20 rounded-xl px-4 py-2.5 font-sans text-sm text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="gold-button px-6 py-2 rounded-xl font-sans text-xs font-bold uppercase tracking-widest cursor-pointer active:scale-95 transition-transform"
              >
                Send note
              </button>
            </div>
          </form>
        </div>
      )}

      {subTab === "affection" && (
        <AffectionAltar />
      )}

      {/* Floating Action Button (FAB) - Dream Logs tab only */}
      {subTab === "logs" && (
        <button
          onClick={() => setShowAddDreamModal(true)}
          className="fixed bottom-24 right-6 w-14 h-14 gold-silk-gradient rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform z-40 cursor-pointer"
          aria-label="Add Dream vision"
        >
          <span className="material-symbols-outlined text-surface text-3xl font-bold">history_edu</span>
        </button>
      )}

      {/* Record Dream / Gemini Interpreter Oracle Popup Modal */}
      {showAddDreamModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] overflow-y-auto animate-fade-in">
          <div className="glass-card max-w-2xl w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-primary/20 space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
              <h3 className="font-display text-2xl text-primary italic font-bold">Cast Intimate Dream Vision</h3>
              <button
                onClick={() => {
                  setShowAddDreamModal(false);
                  setInterpretationResult(null);
                }}
                className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer"
              >
                close
              </button>
            </div>

            {!interpretationResult && !isInterpreting && (
              // STEP 1: Enter Dream details
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-bold tracking-widest text-secondary uppercase mb-2">
                    Dream Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a title or leave empty for AI generation..."
                    value={dreamTitle}
                    onChange={(e) => setDreamTitle(e.target.value)}
                    className="w-full bg-surface-container/40 border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold tracking-widest text-secondary uppercase mb-2">
                    Dream Narrative (Write down your vision memories)
                  </label>
                  <textarea
                    required
                    placeholder="Describe the landscape, waters, earth, elements, colors, and feelings..."
                    value={dreamNarrative}
                    onChange={(e) => setDreamNarrative(e.target.value)}
                    className="w-full bg-surface-container/40 border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-on-surface focus:outline-none focus:border-primary h-28 resize-none text-sm leading-relaxed"
                  />
                </div>

                {/* Taurus Sensory Anchors selector */}
                <div>
                  <label className="block text-xs font-sans font-bold tracking-widest text-secondary uppercase mb-2">
                    Taurus Sensory Anchors (Physical touch &amp; grounding seeds)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {taurusSensoryOptions.map((opt) => {
                      const selected = selectedSensoryAnchors.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleSensoryOption(opt)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                            selected 
                              ? "bg-secondary/20 border-secondary text-secondary font-semibold"
                              : "border-white/5 bg-surface-container-high/40 text-on-surface-variant hover:border-secondary/30"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cancer Emotional Echoes selector */}
                <div>
                  <label className="block text-xs font-sans font-bold tracking-widest text-primary uppercase mb-2">
                    Cancer Emotional Echoes (Intuitive depths &amp; past memories)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cancerEmotionalOptions.map((opt) => {
                      const selected = selectedEmotionalEchoes.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleEmotionalOption(opt)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                            selected 
                              ? "bg-primary/20 border-primary text-primary font-semibold"
                              : "border-white/5 bg-surface-container-high/40 text-on-surface-variant hover:border-primary/30"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Synergy Choice */}
                <div>
                  <label className="block text-xs font-sans font-bold tracking-widest text-on-surface-variant uppercase mb-2">
                    Vibrational Synergy Resonance
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSynergyChoice("Solo Journey")}
                      className={`p-3 rounded-xl border text-xs font-bold tracking-wider uppercase text-center transition-all cursor-pointer ${
                        synergyChoice === "Solo Journey"
                          ? "bg-surface-container-high border-secondary text-secondary"
                          : "border-white/5 text-on-surface-variant"
                      }`}
                    >
                      Solo Journey
                    </button>
                    <button
                      type="button"
                      onClick={() => setSynergyChoice("Two-Heart Resonance")}
                      className={`p-3 rounded-xl border text-xs font-bold tracking-wider uppercase text-center transition-all cursor-pointer ${
                        synergyChoice === "Two-Heart Resonance"
                          ? "bg-surface-container-high border-primary text-primary"
                          : "border-white/5 text-on-surface-variant"
                      }`}
                    >
                      Two-Heart Resonance
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!dreamNarrative.trim()}
                  onClick={handleInterpretDream}
                  className="w-full gold-button py-4 rounded-xl font-sans font-bold text-sm tracking-widest uppercase disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
                >
                  Synthesize &amp; Interpret with AI
                </button>
              </div>
            )}

            {isInterpreting && (
              // STEP 2: Loading State
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <span className="material-symbols-outlined text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl animate-pulse">
                    auto_awesome
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-display text-xl text-primary font-medium italic">Summoning Gemini Dream Oracle...</h4>
                  <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed">
                    Channeling Earthly Grounding &amp; Emotional Tides. Bridging physical structures with intuitive currents...
                  </p>
                </div>
              </div>
            )}

            {interpretationResult && !isInterpreting && (
              // STEP 3: Show result and confirm save
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-secondary-container/10 to-primary-container/10 border border-primary/10">
                  <span className="font-sans text-[10px] text-primary font-bold tracking-widest uppercase">SYNERGY ALIGNMENT SCORE</span>
                  <h4 className="font-display text-4xl text-on-surface font-extrabold mt-1">{interpretationResult.harmony}%</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-sans font-bold text-secondary uppercase tracking-widest block mb-1">Generated Title</span>
                    <h5 className="font-display text-lg text-on-surface font-semibold italic">{interpretationResult.title}</h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-secondary-container/5 border border-secondary/10 p-4 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-sans font-bold text-secondary uppercase tracking-widest block">Taurus Earthly Grounding</span>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{interpretationResult.earthlyGrounding.description}</p>
                      <span className="text-[9px] font-sans font-bold text-secondary uppercase block pt-1">Action: {interpretationResult.earthlyGrounding.action}</span>
                    </div>

                    <div className="bg-primary-container/5 border border-primary/10 p-4 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-sans font-bold text-primary uppercase tracking-widest block">Cancer Emotional Tides</span>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{interpretationResult.emotionalTides.description}</p>
                      <span className="text-[9px] font-sans font-bold text-primary uppercase block pt-1">Guidance: {interpretationResult.emotionalTides.intuition}</span>
                    </div>
                  </div>

                  <div className="bg-surface-container/30 border border-white/5 p-4 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-sans font-bold text-primary uppercase tracking-widest block">Unified Altar Synthesis</span>
                    <p className="text-xs text-on-surface leading-relaxed italic">{interpretationResult.synthesis}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
                  <button
                    onClick={() => setInterpretationResult(null)}
                    className="w-1/3 bg-surface-container-high/50 hover:bg-surface-container-high text-on-surface font-sans text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl cursor-pointer"
                  >
                    Re-Analyze
                  </button>
                  <button
                    onClick={handleSaveDream}
                    className="w-2/3 gold-button py-3.5 rounded-xl font-sans font-bold text-xs tracking-widest uppercase cursor-pointer"
                  >
                    Cast to Shared Altar Archive
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
