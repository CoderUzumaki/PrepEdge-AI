import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  getSiteUrl,
  SITE_NAME,
} from "@/config/site";

/**
 * @param {string} attr
 * @param {string} key
 * @param {string} content
 */
function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * @param {string} rel
 * @param {string} href
 */
function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * PageSeo — updates document title, OG/Twitter meta, canonical, and optional JSON-LD.
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.path]
 * @param {string} [props.image]
 * @param {boolean} [props.noIndex]
 * @param {Object} [props.jsonLd]
 */
export function PageSeo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  jsonLd,
}) {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const pageUrl = `${siteUrl}${path}`;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", pageUrl);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", imageUrl);
    upsertLink("canonical", pageUrl);

    if (noIndex) {
      upsertMeta("name", "robots", "noindex, nofollow");
    } else {
      upsertMeta("name", "robots", "index, follow");
    }

    let scriptEl = null;
    if (jsonLd) {
      scriptEl = document.getElementById("page-json-ld");
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "page-json-ld";
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      if (scriptEl?.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [title, description, path, image, noIndex, jsonLd]);

  return null;
}
