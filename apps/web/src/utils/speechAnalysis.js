export function analyzeSpeech(words) {
  if (!words.length) return { analyzedWords: [], stats: null };

  const analyzedWords = words.map((w) => ({
    word: w.word,
    confidence: w.confidence ?? 0.8,
    level: (w.confidence ?? 0.8) >= 0.85 ? "high" : (w.confidence ?? 0.8) >= 0.6 ? "medium" : "low",
  }));

  const avgConfidence =
    analyzedWords.reduce((s, w) => s + w.confidence, 0) / analyzedWords.length;

  return {
    analyzedWords,
    stats: {
      wordCount: analyzedWords.length,
      avgConfidence: Math.round(avgConfidence * 100),
      highConfidence: analyzedWords.filter((w) => w.level === "high").length,
      lowConfidence: analyzedWords.filter((w) => w.level === "low").length,
    },
  };
}
