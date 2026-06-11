export const parseJsonResponse = (text) => {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in AI response");
  }
  return JSON.parse(jsonMatch[0]);
};

export const normalizeAiText = (value, fallback = "") => {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map((item) => String(item)).join("\n");
  if (value && typeof value === "object") return JSON.stringify(value, null, 2);
  return fallback;
};
