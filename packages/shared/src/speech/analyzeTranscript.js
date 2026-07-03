/**
 * @module shared/speech/analyzeTranscript
 * @description Client-side heuristics for speech metrics from a transcript (Groq Whisper output).
 */

const FILLER_PHRASES = ["you know", "sort of", "kind of", "i mean"];
const FILLER_WORDS = new Set(["um", "uh", "like", "basically", "actually", "literally", "right"]);

/**
 * @param {string} text - Final transcript text
 * @param {number} [durationSeconds] - Speaking duration for pace calculation
 * @returns {{ wordCount: number, fillerCount: number, wordsPerMinute: number, durationSeconds: number, fillerWords: string[] }}
 */
export function analyzeTranscript(text, durationSeconds = 0) {
  const normalized = (text || "").trim().toLowerCase();
  if (!normalized) {
    return {
      wordCount: 0,
      fillerCount: 0,
      wordsPerMinute: 0,
      durationSeconds,
      fillerWords: [],
    };
  }

  const fillerHits = [];

  for (const phrase of FILLER_PHRASES) {
    const regex = new RegExp(`\\b${phrase.replace(/\s+/g, "\\s+")}\\b`, "gi");
    const matches = normalized.match(regex);
    if (matches) {
      matches.forEach((m) => fillerHits.push(m.toLowerCase()));
    }
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    const clean = token.replace(/[^a-z']/g, "");
    if (FILLER_WORDS.has(clean)) {
      fillerHits.push(clean);
    }
  }

  const wordCount = tokens.length;
  const fillerCount = fillerHits.length;
  const wordsPerMinute =
    durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 0;

  return {
    wordCount,
    fillerCount,
    wordsPerMinute,
    durationSeconds,
    fillerWords: [...new Set(fillerHits)].slice(0, 20),
  };
}
