/**
 * @module speech/speechSummary
 * @description Aggregate speech metrics across report answers.
 */

/**
 * @param {Array<{ speechMetrics?: { wordCount?: number, fillerCount?: number, wordsPerMinute?: number } }>} answers
 * @returns {{ avgWpm: number, totalFillers: number, questionsWithSpeech: number } | null}
 */
export function computeSpeechSummary(answers = []) {
  const withMetrics = answers.filter((a) => (a.speechMetrics?.wordCount ?? 0) > 0);
  if (!withMetrics.length) return null;

  const totalFillers = withMetrics.reduce(
    (sum, a) => sum + (a.speechMetrics?.fillerCount ?? 0),
    0
  );
  const avgWpm = Math.round(
    withMetrics.reduce((sum, a) => sum + (a.speechMetrics?.wordsPerMinute ?? 0), 0) /
      withMetrics.length
  );

  return { avgWpm, totalFillers, questionsWithSpeech: withMetrics.length };
}
