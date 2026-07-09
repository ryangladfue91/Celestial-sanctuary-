import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// In-Memory Database for persistent feel across clicks
let notes = [
  {
    id: "note-1",
    sender: "Taurus",
    type: "SUGGESTION",
    text: "Let's try that herb garden ritual this weekend. I've found the perfect windowsill for the rosemary and moonflower. 🌿",
    time: "2h ago",
    pinned: true
  },
  {
    id: "note-2",
    sender: "Cancer",
    type: "QUESTION",
    text: "How are you feeling after this morning's transit? Your energy felt a bit heavy during the meditation. Sending silver light your way. ✨",
    time: "5h ago",
    pinned: false
  },
  {
    id: "note-3",
    sender: "Shared Vision",
    type: "REFLECTION",
    text: '"The Altar of Shared Dreams is starting to look beautiful. Every crystal we add feels like an anchor for our future."',
    time: "Yesterday",
    pinned: false
  }
];

let loveNotes = [
  {
    id: "love-1",
    sender: "Taurus",
    receiver: "Cancer",
    text: "I love how you make our home feel like a warm, protective sanctuary. Your intuitive nature is the water that makes my earthly roots bloom. 🌊💚",
    anchor: "Emotional Nurturing",
    time: "2h ago",
    sparkles: 5
  },
  {
    id: "love-2",
    sender: "Cancer",
    receiver: "Taurus",
    text: "I love your unwavering strength and the quiet peace you bring. When the world gets too noisy, your grounded presence is my safe harbor. 🏔️✨",
    anchor: "Grounded Comfort",
    time: "5h ago",
    sparkles: 8
  }
];

let dreams = [
  {
    id: "dream-1",
    title: "The Silver Lake Reflection",
    date: "Oct 24, 2023",
    narrative: "In this shared vision, we stood on opposite banks. The water between us held the secrets of our upcoming transit, vibrating with a low, grounding hum. The silver moon was reflected perfectly on the flat surface.",
    tags: ["Lucid", "Lunar"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHES37A6yCu1Jrvz4QBcR2Avz8BTT2cSQmGTRkMKfpXjm7KRGvtEPSMYispWP40npigdzosNU93EUb57RXJ9dG6LJfXgkHdmI0B8qE2LtlaHO9N7raxFcD7IXYjJFJlosapIc9gtlclrGbtZl5N-NTX8SkzgmtwEilh6uDvzh09dAJrXX3_m7aIBsijYnkANVEhw_IERmNXSXjOyozNKXkchsBEnqxZ3_Q-d-XiVDoj54Toit8W4gsKJD9nqwvo0Dl6iwReACzaS2W",
    harmony: 88,
    earthlyGrounding: {
      description: "The appearance of the silver lake signifies a desire for tangible security. For Taurus, the cool water reflects a physical need for comfort and sensory indulgence within the home sanctuary.",
      symbol: "Crystal Clear Water (Clarity of Value)",
      action: "Plant new seeds of financial growth or rearrange physical artifacts."
    },
    emotionalTides: {
      description: "The emotional resonance of the 'reflection' speaks to Cancer's intuitive nature. Your subconscious is navigating the deep waters of past memories to find a new emotional equilibrium with your partner.",
      feeling: "Profound emotional release",
      intuition: "Trust the unspoken currents in your shared spaces."
    },
    synthesis: "A Grounded Ocean of Connection. This dream serves as a bridge between the physical world and the emotional realm. For the Taurus/Cancer pair, it suggests that your shared security is now intrinsically linked to your emotional vulnerability. The Silver Lake Reflection indicates that as you build your physical life together (Taurus), you are also creating a mirror for each other's deepest feelings (Cancer). Strengthening this bond requires both a soft touch and a firm foundation."
  },
  {
    id: "dream-2",
    title: "The Golden Roots",
    date: "Oct 21, 2023",
    narrative: "A dense and glowing moss floor where golden tree roots intertwined into a dark fertile soil. Crystalline lime-green mushrooms sprouted, casting a warm soft light around.",
    tags: ["Earthly"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAw4H5B87jAdaSxrAiSNNsiWXMmoKtsixBscqRrlA6C2dAGE8jw6ikofa9L5nBrPBzUOmlweYScCGt7SlvQG9G979QJSkhshk4G0Z3W4RgYrskrb3upMJ5Xkr3kTzOEU5_dlujQ-sN8VklRHS_FU90vbOfP8QnllVGeKUkDs448ORb73lmluSRUwZmIVFx9jpHmMioWv1-5SLvMdq2Ra7UpAPe3_Ao11JOo6CJN_JUD0wDakKEYKLh3MufVAF15wmtiHUqtDSKKdBTU",
    harmony: 94,
    earthlyGrounding: {
      description: "Deep ancient soil representing the unbreakable bedrock of your relationship. Moss growth indicates prosperity.",
      symbol: "Intertwined Golden Roots (Deep Stability)",
      action: "Walk barefoot together on soil or complete a sensory sanctuary audit."
    },
    emotionalTides: {
      description: "The glowing mushrooms represent quiet emotional truths emerging. Water element feeds these roots silently from underneath.",
      feeling: "Warm protective shelter",
      intuition: "Nurture your home as if it were a rare sacred forest."
    },
    synthesis: "The Roots of Trust. Your bond is growing deep, structured support. The golden roots represent Taurus stability feeding off Cancer's quiet water reserves. Together, you are untouchable by the storms outside."
  },
  {
    id: "dream-3",
    title: "Ascending the Eye",
    date: "Oct 19, 2023",
    narrative: "An abstract swirling nebula in shades of indigo. A starry crystal staircase led upwards into a giant cosmic portal shaped like an all-seeing eye.",
    tags: ["Celestial"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk2NXXSTGUEv_1Px3mcM16Th6gVY9FL1245FakbjDYQKIGp-AiVesAsWDJNde0ZsvPv47EwvqfU0hWzi7G23gAav0rx1eqHrZKbWV6bIMdH37uYCtlQT-Zonw3YnTbdjHaTT6wmL6INDl3nunvoX_tlYtwTEKK_1TPVqCc2KpfyzgIAG_y413Om1HQB75nrZkcl91ijbv3248ZaHIEOdo8hXIt2zwv3i20ZaSDVG0k9kPoesFQOpKS8U9FNEydJVvUx7C0NVxJWEeF",
    harmony: 82,
    earthlyGrounding: {
      description: "The staircase represents a physical climb, reminding Taurus that higher spiritual elevations require solid steps.",
      symbol: "Starlight Staircase (Constructed Path)",
      action: "Set a combined long-term aspiration or review shared savings."
    },
    emotionalTides: {
      description: "The eye is Cancer's cosmic psychic portal. It represents feeling seen and understood at a level that transcends words.",
      feeling: "Ethereal weightlessness",
      intuition: "Allow yourselves to dream beyond immediate horizons."
    },
    synthesis: "The Visionary Eye. A call to combine Taurus constructiveness with Cancer's divine vision. Plan the staircase carefully while gazing into the cosmic infinite."
  },
  {
    id: "dream-4",
    title: "The Confluence of Elements",
    date: "Oct 15, 2023",
    narrative: "Two hands reached out: one translucent and fluid like water, the other structured and laced with shimmering gold leaf. A single point of bright white light ignited where they touched.",
    tags: ["Shared Ritual"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjYPRQHSFDAhNm2_tx_lhSFNlXCBvXLqwh_ElFaWvGodUrn0BVoPzMsSFcSPyUcuNe4nYbzcrgqf_GvP5vVYmM-oJFCYaBCHTQn6xosTZykkg0unnj6GiV6BQi2gZrhfP591sx51NNwGiSl9YNT7p17wPSADRVGsHXXNq4IhyMTLTi1UE0rbqLhIF6sDxy8naZE1ycS8vPoz7iZ-39m3vSAjLle0HWizKlPmGxGgivETkL2zPsQhOoTLOErXuIHf0Cx5nIAr5QNue-",
    harmony: 98,
    earthlyGrounding: {
      description: "The gold-leaf hand anchors the connection into material space, promising lasting physical touch and luxury.",
      symbol: "Gold Leaf Rings & Velvet Chiaroscuro",
      action: "Cook a decadent meal together using organic herbs."
    },
    emotionalTides: {
      description: "The translucent hand is Cancer's spiritual presence, offering limitless empathy and emotional depths.",
      feeling: "Absolute safety and union",
      intuition: "Your touch has healing power. Never underestimate physical presence."
    },
    synthesis: "Perfect Harmonic Union. Water meets earth to form fertile clay. This represents the ultimate integration of Taurus grounding with Cancer's nurturing flow, unleashing an energetic spark of absolute creation."
  }
];

let profile = {
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
};

let burdens = ["Old doubts", "Morning anxiety", "Past regrets"];

let activeChallenge = {
  accepted: false,
  title: "Altar of Shared Dreams",
  description: "Combine Taurus's physical manifestation with Cancer's visionary intuition. This week, find a physical object that represents a goal you share, and place it in a prominent spot in your home. Every time you pass it, whisper one word of encouragement to your partner."
};

let customImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBw0UsUVhspo_ovdsT3tzw_mL-Mvhq5xvYOsNL-tJrRqyDSxEwvvXSXez1OXyuJ45UcP6qNIv6W2t1tW7wzsSRHHoS3V5KfsFxsQueUd9VGcYAF1EVp7WgFg1yxZe42okVwMT7fWjKzdkQdnNMmCGP8FdbL3UwO63IxjhSkgx2tcJOTXunQqarbrXc1S2ya_IgTezcWvjWCoOU9y-qAP7LUamolCThYX3nwgTv72jRaXA7d9BLa6z4ccCVlOEALgdqrvvxd4YxEJra1",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDHkporE0VitYQ3-gEGzCMMtk6jfN8INbn4QIhcLMXcjFwdZehspVITnEtpPQr5RE0Bn7dLRZFZ_Z3KQo81B_aQCNvtJ0vbgsmEs6YYpGaJoOAH1sRQGqMqmxTNBIXXOqXoLmaNY_Xd3PFJ8XdnsTb1_rvDvm6zPEuOOt8pEAKZZL4Z6-q4FGY0LXSB3zWEWsbU1Qp2YLk2x76z-62qGOAt163ZHkt294cQawz9FYxTKsrXSY_P2IJKBuUjBfV7asDH-l7QoFfQzQjZ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDER58IKQkFfZkoJ3Msrq26NIP8MjWJlO6yw-cHj7iwxWfc2R-JBNVSmQOOiczDgE4T0NabUVrerL3BboQfYkLYq3GUaXzfKuz4ta2JrdtI0b1TaelfF1camdLlaQuOIq3jHF9m5Ab8_UCMIGjO26i1sgCbUODDfMXeBJo-p9hSWSDulIqylzJsWLDoN7deGHGiuTQSpUwYeLHdDSnUufUD6XttrPxv8P8OWHmfxRZKWyg7o0rT27uC7YOkAIgpAWX2lEXpahdTfRD0",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAS1brEkp2lxT-LWf7jW4jhCqOITQRbvDYkk883_V4ZG5GeELSIFMaf1ygGxMgTIvBYPY6st0qsbOmuQKqpJobSx6Ud2INrN_B5xCEHbXZ1HWb_DHMaQ_c0XPmXeybmkTo6BnC3hkWOn3aUuDvrfJ6U_k5io8j0X6njqUPJMwRFNGAbo3-cnsFHmusJaGtoW4OJsQTOjijtd5RGoElZPkCwsAZ1Q4ThwjgssL9fOpouZH6usSvA-_oqME_ILNNZ13Cixlv0SMONfeSa",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBsj3eWm48pnTRthVWFDMhEVaqm7MXKr5Fqxf60OV6ooK-oQEAwcfz6-l3nM8YFZHQ6ZDHinUjR3G0zDQkK7PMDFKo4p7qdaWixEOTpAmI7HqJOs6ZQQml75Ho8GS_L0Yet1m9J7ywE7Iv4gzxJ-HWftYtYB0MGS9-DwTIrjqzpw8StPHqKiQsimLgJbW5UvVyj1K5ErKEM2uAMfd6BjYr4ZAXbg4Qc2nUbJl7VVxZe9v906_rfHllTGJubt7gwBxH_fB3Lf6lJXFKa",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCz4F3dXqPUv4UZLyk6JGYQO2llA5G1Sx-vRq_aY3dF8EsV5Q2LZ9BYJ5qVHhtJgx-S8YKO3szKtIrta0iZR2yhqmudOeh4pA3fNA69BS4STTN_ND3iCOXHOwiA1xGtPaDGCCVQdPaDCUad4tVEkAK7nxxrjB_uX5RvktR6BtE94GVubIUcpO808ItwrQonlAP1o7u6XWTxJKuZsIHvUvtdLf7HsFh8Afec8l2pq5NjfhasmR4ILWOGYSMiVh_TL1dXk1HdcvHyWuL4"
];

// Fallback pool of high quality astro descriptions in case Gemini is not active
const ASTRO_POOL = [
  "Venus enters Taurus today, bringing a powerful current of sensory luxury. Spend time holding hands, watering household plants, or cooking with fresh rosemary. Taurus stability forms the bowl into which Cancer's sweet water flows.",
  "The Moon transitions through Cancer, activating a quiet, nesting energy. Build a blanket sanctuary in your living room and turn off bright lights. Share a deep, unspoken vulnerability with your partner.",
  "Mercury in sextile to your ascendants prompts sweet, grounding conversations. Discuss long-term financial security and aesthetic improvements to your shared altar space.",
  "A quiet, reflective day for earth and water. No heavy aspects are active. Simply enjoy each other's physical presence while reading or listing melodies that weave your pasts together."
];

// 1. Interpret dream with Gemini (or fallback dynamically if key not present)
app.post("/api/interpret-dream", async (req, res) => {
  const { text, sensoryAnchors, emotionalEchoes, synergy } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Dream description is required" });
  }

  const client = getGeminiClient();
  if (client) {
    try {
      const prompt = `Interpret the following dream narrative for a Taurus and Cancer couple.
Dream Narrative: "${text}"
${sensoryAnchors && sensoryAnchors.length > 0 ? `Taurus Sensory Anchors: ${sensoryAnchors.join(", ")}` : ""}
${emotionalEchoes && emotionalEchoes.length > 0 ? `Cancer Emotional Echoes: ${emotionalEchoes.join(", ")}` : ""}
Synergy Choice: ${synergy || "Solo Journey"}

You MUST provide a JSON response in the specified schema.
Taurus is Earth (Grounded, sensory, comfortable, financial security, tangible).
Cancer is Water (Intuitive, emotional, nesting, domestic sanctuary, reflective).

Provide:
1. "harmony": integer from 50 to 100
2. "title": descriptive 2-5 word celestial title for the dream
3. "earthlyGrounding": object with "description" (Taurus angle, 2-3 sentences), "symbol" (tangible symbol, e.g. "Emerald moss"), "action" (grounding advice)
4. "emotionalTides": object with "description" (Cancer angle, 2-3 sentences), "feeling" (emotional resonance, e.g. "Release"), "intuition" (intuitive tip)
5. "synthesis": 2-3 sentences summarizing the union of Taurus Earth and Cancer Water in this dream.
6. "visualAltarPrompt": a beautiful painterly visual generation prompt describing a mystical scene embodying this dream.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              harmony: { type: Type.INTEGER },
              title: { type: Type.STRING },
              earthlyGrounding: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  symbol: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["description", "symbol", "action"]
              },
              emotionalTides: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  feeling: { type: Type.STRING },
                  intuition: { type: Type.STRING }
                },
                required: ["description", "feeling", "intuition"]
              },
              synthesis: { type: Type.STRING },
              visualAltarPrompt: { type: Type.STRING }
            },
            required: ["harmony", "title", "earthlyGrounding", "emotionalTides", "synthesis", "visualAltarPrompt"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: any) {
      console.error("Gemini interpretation failed, using dynamic generator instead:", err);
    }
  }

  // Robust dynamic generator fallback
  const randomHarmony = Math.floor(Math.random() * 20) + 80; // 80 - 99
  const presetImages = customImages;
  const chosenImage = presetImages[Math.floor(Math.random() * presetImages.length)];

  const genericResponse = {
    harmony: randomHarmony,
    title: text.split(" ").slice(0, 3).join(" ") + " Alignment" || "Ethereal Echoes",
    earthlyGrounding: {
      description: "The sensory weight of this vision anchors your combined desires in tangible comfort. For Taurus, the material details suggest a need to focus on tactile satisfaction and deep domestic stability.",
      symbol: "Gilded Ivy and Polished Quartz",
      action: "Prepare a warm sensory bath or arrange natural objects on your windowsill."
    },
    emotionalTides: {
      description: "Your dream water levels are fluctuating, indicating high intuitive receptivity. For Cancer, this reflects the shifting sands of old feelings being washed away to make room for deep mutual vulnerability.",
      feeling: "Cathartic peace and acceptance",
      intuition: "Listen to the physical hum of your home at dusk."
    },
    synthesis: "A beautiful alignment where Taurus acts as the safe, solid stone container and Cancer flows as the calming moonlit current, washing over old blocks and crystallizing new foundations.",
    visualAltarPrompt: "A serene, mystical painting of a silver moon reflecting on a dark, calm lake, surrounded by ancient weeping willow trees with glowing lanterns.",
    image: chosenImage
  };

  return res.json(genericResponse);
});

// 2. GET cosmic advice
app.get("/api/cosmic-advice", async (req, res) => {
  const client = getGeminiClient();
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Write a one-sentence intimate cosmic astrological advice (Taurus stability + Cancer emotional depth) for a romantic couple today. Focus on food, touch, warmth, nesting, or shared music.",
        config: {
          systemInstruction: "You are a gentle celestial matches counselor. Keep it deeply romantic, comforting, short, and under 30 words."
        }
      });
      return res.json({ advice: response.text?.trim() || ASTRO_POOL[0] });
    } catch (err) {
      console.error("Gemini advice failed, falling back:", err);
    }
  }
  const randomAdvice = ASTRO_POOL[Math.floor(Math.random() * ASTRO_POOL.length)];
  return res.json({ advice: randomAdvice });
});

// Get note list
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Post a new note
app.post("/api/notes", (req, res) => {
  const { sender, type, text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }
  const newNote = {
    id: `note-${Date.now()}`,
    sender: sender || "Shared Vision",
    type: type || "LOVE NOTES",
    text,
    time: "Just now",
    pinned: false
  };
  notes.unshift(newNote);
  res.json(newNote);
});

// Delete note (unpin or delete from array)
app.delete("/api/notes/:id", (req, res) => {
  notes = notes.filter(n => n.id !== req.params.id);
  res.json({ success: true });
});

// Get love notes list
app.get("/api/love-notes", (req, res) => {
  res.json(loveNotes);
});

// Post a new love note
app.post("/api/love-notes", (req, res) => {
  const { sender, receiver, text, anchor } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Content is required" });
  }
  const newLoveNote = {
    id: `love-${Date.now()}`,
    sender: sender || "Taurus",
    receiver: receiver || "Cancer",
    text,
    anchor: anchor || "Grounded Comfort",
    time: "Just now",
    sparkles: 0
  };
  loveNotes.unshift(newLoveNote);
  res.json(newLoveNote);
});

// Sparkle a love note
app.post("/api/love-notes/:id/sparkle", (req, res) => {
  const note = loveNotes.find(n => n.id === req.params.id);
  if (note) {
    note.sparkles = (note.sparkles || 0) + 1;
    res.json(note);
  } else {
    res.status(404).json({ error: "Love note not found" });
  }
});

// Delete a love note
app.delete("/api/love-notes/:id", (req, res) => {
  loveNotes = loveNotes.filter(n => n.id !== req.params.id);
  res.json({ success: true });
});

// Get dreams list
app.get("/api/dreams", (req, res) => {
  res.json(dreams);
});

// Post a new dream
app.post("/api/dreams", (req, res) => {
  const { title, narrative, tags, earthlyGrounding, emotionalTides, harmony, synthesis, image } = req.body;
  const newDream = {
    id: `dream-${Date.now()}`,
    title: title || "New Vision Archive",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    narrative: narrative || "",
    tags: tags || ["Shared Altar"],
    image: image || customImages[Math.floor(Math.random() * customImages.length)],
    harmony: harmony || 85,
    earthlyGrounding: earthlyGrounding || {
      description: "Taurus anchoring elements are emerging to support this dream's weight.",
      symbol: "Pebble in still water",
      action: "Step outside onto green moss or water your houseplants."
    },
    emotionalTides: emotionalEchoesFallback(narrative),
    synthesis: synthesis || "Your earth and water elements have merged seamlessly."
  };
  dreams.unshift(newDream);
  res.json(newDream);
});

function emotionalEchoesFallback(narrative: string) {
  return {
    description: "The subconscious emotional tide is rising to clean old channels.",
    feeling: "Tranquil stillness",
    intuition: "Rely on physical comfort when emotional waves become choppy."
  };
}

// Get/Set Profile Settings
app.get("/api/profile", (req, res) => {
  res.json(profile);
});

app.post("/api/profile", (req, res) => {
  profile = { ...profile, ...req.body };
  res.json(profile);
});

// Get/Set burdens (Emotional Clearing)
app.get("/api/burdens", (req, res) => {
  res.json(burdens);
});

app.post("/api/burdens", (req, res) => {
  const { burden } = req.body;
  if (burden && burden.trim() !== "") {
    burdens.push(burden);
  }
  res.json(burdens);
});

app.delete("/api/burdens/:index", (req, res) => {
  const idx = parseInt(req.params.index, 10);
  if (!isNaN(idx) && idx >= 0 && idx < burdens.length) {
    burdens.splice(idx, 1);
  }
  res.json(burdens);
});

// Active weekly challenge status
app.get("/api/challenge", (req, res) => {
  res.json(activeChallenge);
});

app.post("/api/challenge/accept", (req, res) => {
  activeChallenge.accepted = true;
  res.json(activeChallenge);
});

app.post("/api/challenge/reset", (req, res) => {
  activeChallenge.accepted = false;
  res.json(activeChallenge);
});

// Generate Vision Altar Image directly (nano banana model)
app.post("/api/generate-vision-altar", async (req, res) => {
  const { prompt } = req.body;
  const client = getGeminiClient();
  
  if (client) {
    try {
      // Use the general image generation nano banana model as specified in the SKILL.md: 'gemini-3.1-flash-lite-image'
      const response = await client.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            { text: prompt || 'A mystical painterly cosmic altar of Taurus green moss and Cancer silver full moon and water ripple, high quality, digital art, dark indigo space' }
          ]
        }
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64 = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64}`;
          return res.json({ image: imageUrl });
        }
      }
    } catch (err) {
      console.error("Image generation failed, returning high-quality fallback:", err);
    }
  }

  // Secure fallback image URL from the existing set of gorgeous pre-built links
  const fallbackImg = customImages[Math.floor(Math.random() * customImages.length)];
  return res.json({ image: fallbackImg });
});


// Serve API health state
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server", err);
  process.exit(1);
});
