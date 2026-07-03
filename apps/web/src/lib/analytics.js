import { track } from "@vercel/analytics";

/**
 * Fires a Vercel Analytics custom event (M8).
 * @param {"signup"|"interview_complete"|"pdf_download"|"demo_click"} name
 * @param {Record<string, string | number | boolean>} [properties]
 */
export function trackEvent(name, properties) {
  if (import.meta.env.DEV) {
    console.debug("[analytics]", name, properties ?? {});
  }
  try {
    track(name, properties);
  } catch {
    // Analytics should never break user flows
  }
}
