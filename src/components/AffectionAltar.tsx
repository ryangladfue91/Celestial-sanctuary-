import React, { useState, useEffect } from "react";
import { LoveNote } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function AffectionAltar() {
  const [loveNotes, setLoveNotes] = useState<LoveNote[]>([]);
  const [text, setText] = useState("");
  const [sender, setSender] = useState<"Taurus" | "Cancer">("Taurus");
  const [anchor, setAnchor] = useState<string>("Grounded Comfort 🏔️");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const anchors = [
    { name: "Grounded Comfort 🏔️", desc: "Taurus security, physical touch, nesting safety" },
    { name: "Emotional Nurturing 🌊", desc: "Cancer empathy, deep sensitivity, protective care" },
    { name: "Culinary Devotion 🍳", desc: "Taurus culinary luxury, delicious home-cooked care" },
    { name: "Whispered Encouragement 💬", desc: "Sweet verbal reassurance and quiet affirmations" },
    { name: "Sacred Presence ✨", desc: "Undivided attention, shared silent peace, healing aura" }
  ];

  const writingPrompts = {
    Taurus: "Taurus Prompt: Cancer's protective shell is soft inside. What intuitive warmth or gentle care did they shower you with that made you feel completely safe today?",
    Cancer: "Cancer Prompt: Taurus is the solid bedrock that anchors your changing tide. What physical comfort, practical support, or sensory delight did they provide that calmed your worries today?"
  };

  useEffect(() => {
    fetchLoveNotes();
  }, []);

  const fetchLoveNotes = () => {
    setLoading(true);
    fetch("/api/love-notes")
      .then((res) => res.json())
      .then((data) => {
        setLoveNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading love notes:", err);
        setLoading(false);
      });
  };

  const handleAddLoveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    const receiver = sender === "Taurus" ? "Cancer" : "Taurus";

    fetch("/api/love-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender,
        receiver,
        text,
        anchor
      })
    })
      .then((res) => res.json())
      .then((newNote) => {
        setLoveNotes([newNote, ...loveNotes]);
        setText("");
        setSubmitting(false);
      })
      .catch((err) => {
        console.error("Error adding love note:", err);
        setSubmitting(false);
      });
  };

  const handleSparkle = (id: string) => {
    fetch(`/api/love-notes/${id}/sparkle`, { method: "POST" })
      .then((res) => res.json())
      .then((updatedNote) => {
        setLoveNotes(loveNotes.map((n) => (n.id === id ? updatedNote : n)));
      })
      .catch((err) => console.error("Error sparkling love note:", err));
  };

  const handleDelete = (id: string) => {
    fetch(`/api/love-notes/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setLoveNotes(loveNotes.filter((n) => n.id !== id));
      })
      .catch((err) => console.error("Error deleting love note:", err));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in duration-500">
      
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full text-primary text-xs font-semibold tracking-wider uppercase">
          <span className="material-symbols-outlined text-sm animate-pulse">volunteer_activism</span>
          Affection Altar
        </div>
        <h3 className="font-display text-3xl md:text-4xl text-on-surface italic">
          What We Love About Each Other
        </h3>
        <p className="font-sans text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          A dedicated space of deep appreciation. Plant seeds of gratitude to ground Taurus roots, and send waves of verbal touch to cradle Cancer&apos;s emotional heart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Create Love Letter Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full pointer-events-none"></div>
            
            <h4 className="font-display text-xl text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">favorite</span>
              Leave an Affection Note
            </h4>

            <form onSubmit={handleAddLoveNote} className="space-y-4">
              {/* Sender Option */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">
                  I am writing as...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSender("Taurus")}
                    className={`py-2 px-4 rounded-xl border text-xs font-bold tracking-wider uppercase text-center transition-all cursor-pointer ${
                      sender === "Taurus"
                        ? "bg-secondary-container/10 border-secondary text-secondary shadow-[0_0_10px_rgba(161,210,170,0.2)]"
                        : "border-white/5 text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                    }`}
                  >
                    Taurus (Earth)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSender("Cancer")}
                    className={`py-2 px-4 rounded-xl border text-xs font-bold tracking-wider uppercase text-center transition-all cursor-pointer ${
                      sender === "Cancer"
                        ? "bg-primary-container/10 border-primary text-primary shadow-[0_0_10px_rgba(210,188,250,0.2)]"
                        : "border-white/5 text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                    }`}
                  >
                    Cancer (Water)
                  </button>
                </div>
              </div>

              {/* Dynamic Writing Prompt Helper */}
              <div className="p-3 bg-surface-container/50 rounded-xl border border-outline-variant/15 text-[11px] leading-relaxed text-on-surface-variant italic font-sans">
                {writingPrompts[sender]}
              </div>

              {/* Affection Anchor Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">
                  Select Affection Anchor
                </label>
                <select
                  value={anchor}
                  onChange={(e) => setAnchor(e.target.value)}
                  className="w-full bg-surface-container text-on-surface text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/20 font-sans"
                >
                  {anchors.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-on-surface-variant/70 italic px-1">
                  Focus: {anchors.find(a => a.name === anchor)?.desc}
                </p>
              </div>

              {/* Note Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider block">
                  What I love about you
                </label>
                <textarea
                  required
                  placeholder={`Write an intimate appreciation for your ${sender === "Taurus" ? "Cancer" : "Taurus"} partner...`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-surface-container/40 border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-on-surface text-sm focus:outline-none focus:border-primary h-28 resize-none leading-relaxed placeholder-on-surface-variant/40"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="w-full gold-button py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-widest cursor-pointer disabled:opacity-40"
              >
                {submitting ? "Placing on Altar..." : "Cast to Affection Altar"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Love Scrolls feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-display text-xl text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">spa</span>
              Consecrated Love Scrolls
            </h4>
            <span className="font-mono text-xs text-on-surface-variant">{loveNotes.length} Gratitudes</span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {loading ? (
              <div className="text-center py-12 text-on-surface-variant italic font-sans text-sm animate-pulse flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                Aligning affection celestial current...
              </div>
            ) : loveNotes.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-outline-variant/20 rounded-2xl text-on-surface-variant italic font-sans text-sm p-6 bg-surface-container-low/10">
                The Affection Altar is pristine and quiet. Use the scroll maker on the left to tell your companion what makes your heart sing.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {loveNotes.map((note) => {
                  const isTaurusSender = note.sender === "Taurus";
                  
                  let senderGlow = "border-secondary/20 bg-secondary-container/5";
                  let senderTextColor = "text-secondary";
                  let senderSignName = "Taurus";
                  let senderSignIcon = "eco";
                  let receiverSignName = "Cancer";
                  let receiverTextColor = "text-primary";
                  
                  if (!isTaurusSender) {
                    senderGlow = "border-primary/20 bg-primary-container/5";
                    senderTextColor = "text-primary";
                    senderSignName = "Cancer";
                    senderSignIcon = "waves";
                    receiverSignName = "Taurus";
                    receiverTextColor = "text-secondary";
                  }

                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`glass-card p-5 rounded-2xl border flex flex-col justify-between gap-4 relative group hover:border-white/10 transition-colors shadow-lg ${senderGlow}`}
                    >
                      {/* Note Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`material-symbols-outlined text-sm ${senderTextColor}`}>
                            {senderSignIcon}
                          </span>
                          <span className={`font-sans text-xs font-bold uppercase tracking-widest ${senderTextColor}`}>
                            {senderSignName}
                          </span>
                          <span className="material-symbols-outlined text-on-surface-variant/50 text-xs font-light">
                            arrow_right_alt
                          </span>
                          <span className={`font-sans text-xs font-bold uppercase tracking-widest ${receiverTextColor}`}>
                            {receiverSignName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[10px] text-on-surface-variant">{note.time}</span>
                          <button
                            onClick={() => handleDelete(note.id)}
                            className="material-symbols-outlined text-on-surface-variant hover:text-error text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove scroll"
                          >
                            delete
                          </button>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="space-y-2">
                        <div className="inline-block bg-surface-container/60 border border-outline-variant/10 px-2.5 py-0.5 rounded-full text-[10px] text-on-surface-variant font-sans font-medium">
                          Anchor: {note.anchor}
                        </div>
                        <p className="font-sans text-sm leading-relaxed text-on-surface text-shadow-sm italic">
                          &quot;{note.text}&quot;
                        </p>
                      </div>

                      {/* Sparkle Feedback Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                        <span className="font-sans text-[11px] text-on-surface-variant/80 italic flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">auto_awesome</span>
                          Resonating of Taurus earth and Cancer water
                        </span>

                        <button
                          onClick={() => handleSparkle(note.id)}
                          className="flex items-center gap-1.5 bg-surface-container-high/60 hover:bg-primary/10 border border-outline-variant/20 hover:border-primary/30 px-3 py-1.5 rounded-full transition-all text-xs font-semibold text-on-surface hover:text-primary active:scale-90 cursor-pointer"
                          title="Send cosmic sparkles"
                        >
                          <span className="material-symbols-outlined text-xs animate-pulse text-primary fill-current">
                            sparkles
                          </span>
                          <span className="font-mono text-[11px]">{note.sparkles || 0}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
