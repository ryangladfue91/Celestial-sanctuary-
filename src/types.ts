export interface Note {
  id: string;
  sender: "Taurus" | "Cancer" | "Shared Vision";
  type: "SUGGESTION" | "QUESTION" | "REFLECTION" | "LOVE NOTES";
  text: string;
  time: string;
  pinned: boolean;
}

export interface Dream {
  id: string;
  title: string;
  date: string;
  narrative: string;
  tags: string[];
  image: string;
  harmony: number;
  earthlyGrounding: {
    description: string;
    symbol: string;
    action: string;
  };
  emotionalTides: {
    description: string;
    feeling: string;
    intuition: string;
  };
  synthesis: string;
}

export interface ProfileSettings {
  meditationLength: number;
  sensoryTriggers: string[];
  notificationTransits: {
    moonPhases: boolean;
    mercuryRetrograde: boolean;
    sharedRituals: boolean;
  };
  privacyLevel: string;
  syncDreamLogs: boolean;
  archiveExpiration: string;
}

export interface WeeklyChallenge {
  accepted: boolean;
  title: string;
  description: string;
}

export interface LoveNote {
  id: string;
  sender: "Taurus" | "Cancer";
  receiver: "Taurus" | "Cancer";
  text: string;
  anchor: string;
  time: string;
  sparkles: number;
}
