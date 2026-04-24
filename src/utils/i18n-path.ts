/**
 * URL-prefix locales for shareable /tr/... and /en/... routes.
 * Default public locale is Turkish (`tr`).
 */

export const SITE_LOCALES = ["tr", "en"] as const;

export type SiteLocale = (typeof SITE_LOCALES)[number];

export function isSiteLocale(value: string): value is SiteLocale {
  return value === "tr" || value === "en";
}

/**
 * Reads the first path segment when it is `tr` or `en`.
 * Falls back to `tr` for legacy or unexpected paths.
 */
export function localeFromPathname(pathname: string): SiteLocale {
  const m = pathname.match(/^\/(tr|en)(?:\/|$)/);
  if (m && isSiteLocale(m[1])) return m[1];
  return "tr";
}

/**
 * Path without the `/tr` or `/en` prefix (leading slash preserved on rest).
 * `/en/events` → `/events`; `/tr/` → `/`
 */
export function stripLocalePrefix(pathname: string): string {
  const m = pathname.match(/^\/(tr|en)(\/.*)?$/);
  if (!m) return pathname || "/";
  const rest = m[2];
  if (!rest || rest === "/") return "/";
  return rest;
}

/**
 * Builds a same-site path under the given locale (e.g. `/events` → `/en/events`).
 * Leaves `http(s):`, `mailto:`, and `#` links unchanged.
 */
export function localizedPath(currentPathname: string, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (/^\/(tr|en)(\/|$)/.test(href)) return href;
  const locale = localeFromPathname(currentPathname);
  if (href === "/") return `/${locale}/`;
  return `/${locale}${href}`;
}

/**
 * Same as {@link localizedPath} but the locale is explicit (e.g. sitemap, emails).
 */
export function pathForLocale(locale: SiteLocale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (/^\/(tr|en)(\/|$)/.test(href)) return href;
  if (href === "/") return `/${locale}/`;
  return `/${locale}${href}`;
}

