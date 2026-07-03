/**
 * Site-wide SEO and branding constants.
 */
export const SITE_NAME = "PrepEdge AI";

export const DEFAULT_TITLE =
  "PrepEdge AI — AI Mock Interviews with Instant Feedback";

export const DEFAULT_DESCRIPTION =
  "Practice personalized mock interviews with AI scoring, voice analysis, and shareable PDF reports. Try a sample question free — no signup required.";

export const getSiteUrl = () =>
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ||
  "https://prepedgeai.vercel.app";

export const DEFAULT_OG_IMAGE = "/logo.svg";
