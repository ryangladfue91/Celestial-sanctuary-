import React, { useState } from "react";

interface Alignments {
  id: string;
  date: string;
  title: string;
  icon: string;
  badgeColor: string;
  image: string;
  description: string;
  actionText: string;
  type: "taurus" | "cancer";
}

export default function CosmicCalendar({ onNavigateToTab }: { onNavigateToTab: (tab: string) => void }) {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [reminders, setReminders] = useState<{ day: number; note: string }[]>([
    { day: 6, note: "Date Night: Venus enters Taurus stability" },
    { day: 21, note: "Home Sanctuary: Cancer new moon quiet meditation" }
  ]);
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [newReminderDay, setNewReminderDay] = useState(1);
  const [newReminderText, setNewReminderText] = useState("");

  const auspicious = [6, 15, 21, 28];
  const taurusDays = [12, 13];
  const cancerDays = [22, 23];

  const toggleDaySelection = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReminderText.trim()) {
      setReminders([...reminders, { day: newReminderDay, note: newReminderText }]);
      setSelectedDays([...selectedDays, newReminderDay]);
      setNewReminderText("");
      setShowAddReminderModal(false);
    }
  };

  const alignments: Alignments[] = [
    {
      id: "align-1",
      date: "JUN 06",
      title: "Date Night: Venus in Taurus",
      icon: "favorite",
      badgeColor: "text-secondary",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDER58IKQkFfZkoJ3Msrq26NIP8MjWJlO6yw-cHj7iwxWfc2R-JBNVSmQOOiczDgE4T0NabUVrerL3BboQfYkLYq3GUaXzfKuz4ta2JrdtI0b1TaelfF1camdLlaQuOIq3jHF9m5Ab8_UCMIGjO26i1sgCbUODDfMXeBJo-p9hSWSDulIqylzJsWLDoN7deGHGiuTQSpUwYeLHdDSnUufUD6XttrPxv8P8OWHmfxRZKWyg7o0rT27uC7YOkAIgpAWX2lEXpahdTfRD0",
      description: "A peak transit for earthy luxury. Focus on sensory experiences—fine dining or a spa ritual together. The stars favor deep stability and physical expression of love.",
      actionText: "Schedule Ritual",
      type: "taurus"
    },
    {
      id: "align-2",
      date: "JUN 21",
      title: "Home Sanctuary: Moon in Cancer",
      icon: "night_shelter",
      badgeColor: "text-primary",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS1brEkp2lxT-LWf7jW4jhCqOITQRbvDYkk883_V4ZG5GeELSIFMaf1ygGxMgTIvBYPY6st0qsbOmuQKqpJobSx6Ud2INrN_B5xCEHbXZ1HWb_DHMaQ_c0XPmXeybmkTo6BnC3hkWOn3aUuDvrfJ6U_k5io8j0X6njqUPJMwRFNGAbo3-cnsFHmusJaGtoW4OJsQTOjijtd5RGoElZPkCwsAZ1Q4ThwjgssL9fOpouZH6usSvA-_oqME_ILNNZ13Cixlv0SMONfeSa",
      description: "The emotional moon comes home. An ideal night for nesting, deep conversations, and reinforcing your inner emotional bonds. Perfect for a quiet night of reflection.",
      actionText: "Prepare Space",
      type: "cancer"
    }
  ];

  // Render Calendar Grid June 2024 (starts on a Saturday, so 5 empty cells)
  const renderCalendarCells = () => {
    const cells = [];
    // 5 empty days for May tails
    for (let i = 0; i < 5; i++) {
      cells.push(<div key={`empty-${i}`} className="h-14 sm:h-20 opacity-30"></div>);
    }

    // 30 days in June
    for (let day = 1; day <= 30; day++) {
      const isSelected = selectedDays.includes(day);
      const isAuspicious = auspicious.includes(day);
      const isTaurus = taurusDays.includes(day);
      const isCancer = cancerDays.includes(day);
      const dayReminders = reminders.filter((r) => r.day === day);

      let cellStyle = "h-14 sm:h-20 glass-card rounded-xl flex flex-col items-center justify-center relative cursor-pointer select-none transition-all duration-300 hover:border-primary/50";
      
      if (isSelected) {
        cellStyle += " ring-2 ring-primary/40 border-secondary/50 bg-primary-container/20";
      } else if (isAuspicious) {
        cellStyle += " border-primary/30 bg-primary-container/10";
      } else if (isTaurus) {
        cellStyle += " border-secondary/30 bg-secondary-container/10";
      } else if (isCancer) {
        cellStyle += " border-primary/20 bg-primary-container/5";
      }

      cells.push(
        <div
          key={`day-${day}`}
          onClick={() => toggleDaySelection(day)}
          className={cellStyle}
          title={dayReminders.map(r => r.note).join("; ")}
        >
          {/* Day Number */}
          <span className="font-sans text-xs sm:text-sm text-on-surface-variant font-medium">
            {day}
          </span>

          {/* Icon indicator */}
          <div className="mt-1 flex items-center justify-center min-h-[16px]">
            {isAuspicious && (
              <span className="material-symbols-outlined text-primary text-sm sm:text-base">
                auto_awesome
              </span>
            )}
            {isTaurus && (
              <span className="material-symbols-outlined text-secondary text-sm sm:text-base">
                eco
              </span>
            )}
            {isCancer && (
              <span className="material-symbols-outlined text-primary text-sm sm:text-base">
                water_drop
              </span>
            )}
            {!isAuspicious && !isTaurus && !isCancer && day === 15 && (
              <span className="material-symbols-outlined text-on-surface-variant text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                brightness_high
              </span>
            )}
          </div>

          {/* Dot for user-added reminders */}
          {dayReminders.length > 0 && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></div>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="space-y-12 animate-fade-in duration-500 relative pb-16">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h2 className="font-display text-4xl md:text-5xl text-primary italic">
          Moon &amp; Stars Alignment
        </h2>
        <p className="font-sans text-on-surface-variant text-base md:text-lg">
          Your shared cosmic journey for June 2024
        </p>
      </div>

      {/* Monthly Focus Chips */}
      <div className="flex flex-wrap gap-3 justify-center">
        <span className="px-4 py-1.5 glass-card rounded-full font-sans text-xs font-bold tracking-widest text-secondary flex items-center gap-2 border border-secondary/20">
          <span className="material-symbols-outlined text-xs">water_drop</span> CANCER SEASON
        </span>
        <span className="px-4 py-1.5 glass-card rounded-full font-sans text-xs font-bold tracking-widest text-primary flex items-center gap-2 border border-primary/20">
          <span className="material-symbols-outlined text-xs">eco</span> TAURUS STABILITY
        </span>
        <span className="px-4 py-1.5 glass-card rounded-full font-sans text-xs font-bold tracking-widest text-on-surface-variant flex items-center gap-2 border border-white/5">
          <span className="material-symbols-outlined text-xs">brightness_4</span> WAXING GIBBOUS
        </span>
      </div>

      {/* Mystical Calendar Grid */}
      <section className="glass-card rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-2xl">
            chevron_left
          </button>
          <h3 className="font-display text-xl md:text-2xl text-on-surface font-semibold tracking-wide">
            June 2024
          </h3>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-2xl">
            chevron_right
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 text-center font-sans text-xs font-bold tracking-widest text-on-surface-variant/60 mb-4">
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarCells()}
        </div>

        {/* Selected Day Reminders Box */}
        {selectedDays.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-surface-container-high/40 border border-outline-variant/20 animate-fade-in">
            <h4 className="font-sans text-xs font-bold tracking-widest text-secondary uppercase mb-2">
              Cosmic Events for Day {selectedDays[selectedDays.length - 1]}:
            </h4>
            <ul className="space-y-1">
              {reminders
                .filter((r) => r.day === selectedDays[selectedDays.length - 1])
                .map((rem, i) => (
                  <li key={i} className="text-sm font-sans text-on-surface flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    {rem.note}
                  </li>
                ))}
              {reminders.filter((r) => r.day === selectedDays[selectedDays.length - 1]).length === 0 && (
                <li className="text-sm font-sans text-on-surface-variant italic">
                  No transits scheduled. Tap &quot;+&quot; to cast an intention or ritual note for this day.
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Floating Glow elements */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 blur-[60px] rounded-full pointer-events-none"></div>
      </section>

      {/* Auspicious Dates List */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">flare</span>
          <h3 className="font-display text-2xl text-on-surface">Auspicious Alignments</h3>
        </div>

        {alignments.map((align) => (
          <div
            key={align.id}
            className="glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row border border-white/5 shadow-xl hover:border-primary/20 transition-all duration-500 group"
          >
            <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/90 to-transparent z-10"></div>
              <img
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
                alt={align.title}
                src={align.image}
              />
              <div className="absolute bottom-4 left-4 z-20 font-sans text-xs font-bold tracking-widest text-secondary bg-surface-container-lowest/80 px-2.5 py-1 rounded-md">
                {align.date}
              </div>
            </div>

            <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`material-symbols-outlined ${align.badgeColor}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {align.icon}
                  </span>
                  <h4 className="font-display text-xl text-on-surface font-medium">
                    {align.title}
                  </h4>
                </div>
                <p className="font-sans text-on-surface-variant text-sm md:text-base leading-relaxed mb-6">
                  {align.description}
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab("rituals")}
                className="gold-silk-gradient px-6 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-widest self-start active:scale-95 transition-transform cursor-pointer"
              >
                {align.actionText}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Floating Action Button (FAB) - Specific to Calendar (Add Reminder) */}
      <button
        onClick={() => setShowAddReminderModal(true)}
        className="fixed bottom-24 right-6 w-14 h-14 gold-silk-gradient rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform z-40 cursor-pointer"
        aria-label="Add Reminder"
      >
        <span className="material-symbols-outlined text-surface text-3xl font-bold">add</span>
      </button>

      {/* Add Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="glass-card max-w-md w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-primary/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl text-primary italic">Record Cosmic Intention</h3>
              <button
                onClick={() => setShowAddReminderModal(false)}
                className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer"
              >
                close
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-bold tracking-widest text-secondary uppercase mb-2">
                  Select June Day (1 - 30)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newReminderDay}
                  onChange={(e) => setNewReminderDay(parseInt(e.target.value, 10))}
                  className="w-full bg-surface-container/40 border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-bold tracking-widest text-secondary uppercase mb-2">
                  Astrological Note or Shared Plan
                </label>
                <textarea
                  required
                  placeholder="E.g., Cook fresh garden herbs together or star-gaze on the balcony..."
                  value={newReminderText}
                  onChange={(e) => setNewReminderText(e.target.value)}
                  className="w-full bg-surface-container/40 border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-on-surface focus:outline-none focus:border-primary h-24 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full gold-button py-3.5 rounded-xl font-sans font-bold text-sm tracking-widest uppercase cursor-pointer"
              >
                Cast Note on Calendar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
