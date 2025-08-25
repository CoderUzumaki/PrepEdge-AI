const fillerWords = ["uh", "um", "like", "you know", "so"];

export function analyzeSpeech(wordsWithTimestamps) {
  const analyzedWords = [];
  let previousTime = null;

  // Stats counters
  let fillerCount = 0;
  let pauseCount = 0;
  let lowConfidenceCount = 0;
  let confidenceSum = 0;

  for (let i = 0; i < wordsWithTimestamps.length; i++) {
    const { word, time, confidence } = wordsWithTimestamps[i];
    const lower = word.toLowerCase();
    const pauseDuration = previousTime ? time - previousTime : 0;
    previousTime = time;

    let label = "normal";
    let tooltip = "";

    confidenceSum += confidence;

    if (fillerWords.includes(lower)) {
      label = "filler";
      tooltip = `Filler word "${word}"`;
      fillerCount++;
    } else if (pauseDuration > 0.5) {
      label = "pause";
      tooltip = `Pause > ${pauseDuration.toFixed(2)}s`;
      pauseCount++;
    } else if (confidence < 0.6) {
      label = "low-confidence";
      tooltip = `Low confidence: ${(confidence * 100).toFixed(1)}%`;
      lowConfidenceCount++;
    }

    analyzedWords.push({ word, label, tooltip });
  }

  const averageConfidence =
    wordsWithTimestamps.length > 0
      ? confidenceSum / wordsWithTimestamps.length
      : 0;

  // 💡 Define confidence level logic here
  let confidenceLevel = "Confident";
  if (
    lowConfidenceCount > 3 ||
    fillerCount >= 6 ||
    pauseCount >= 5
  ) {
    confidenceLevel = "Hesitant";
  } else if (
    lowConfidenceCount > 0 ||
    fillerCount >= 3 ||
    pauseCount >= 2
  ) {
    confidenceLevel = "Okay";
  }

  const stats = {
    fillerCount,
    pauseCount,
    lowConfidenceCount,
    averageConfidence: (averageConfidence * 100).toFixed(1),
    confidenceLevel, //  now added
  };

  return { analyzedWords, stats };
}
