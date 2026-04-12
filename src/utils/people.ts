import { config } from "@/config";
import { getSortedEvents } from "@/utils/events";
import type { CollectionEntry } from "astro:content";

export type EventEntry = CollectionEntry<"events">;

export interface ConfigSpeaker {
  slug: string;
  name: string;
  nameAr?: string;
  initials: string;
  bio?: string;
  bioAr?: string;
  photo?: string;
  twitter?: string;
  twitterHandle?: string;
  linkedin?: string;
  email?: string;
  /** Alternate names that may appear in event frontmatter (e.g. "Dan (Cursor)"). */
  aliases?: readonly string[];
}

export interface Speaker {
  slug: string;
  name: string;
  nameAr?: string;
  initials: string;
  bio?: string;
  bioAr?: string;
  photo?: string;
  twitter?: string;
  twitterHandle?: string;
  linkedin?: string;
  email?: string;
  /** Whether the speaker also has an ambassador entry in config. */
  isAmbassador: boolean;
  /** All event names this speaker has appeared in (deduped). */
  events: EventEntry[];
}

export interface PartnerWithEvents {
  slug: string;
  name: string;
  nameAr: string;
  role: "official" | "community-partner" | "venue-host" | "past-community-partner";
  logo: string;
  url: string;
  description: string;
  descriptionAr: string;
  cities: readonly string[];
  events: EventEntry[];
}

/** URL-safe slug from a display name. Handles parens, spaces, and case. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const configSpeakers = config.speakers as readonly ConfigSpeaker[];

/** Build a lookup table from any name/alias → ConfigSpeaker. */
function buildSpeakerNameIndex(): Map<string, ConfigSpeaker> {
  const map = new Map<string, ConfigSpeaker>();
  for (const s of configSpeakers) {
    map.set(s.name.toLowerCase().trim(), s);
    for (const alias of s.aliases ?? []) {
      map.set(alias.toLowerCase().trim(), s);
    }
  }
  return map;
}

interface ConfigAmbassador {
  name: string;
  nameAr?: string;
  photo?: string;
  description?: string;
  descriptionAr?: string;
  email?: string;
  twitter?: string;
  twitterHandle?: string;
  linkedin?: string;
}

const configAmbassadors = config.ambassadors as readonly ConfigAmbassador[];
const ambassadorNames = new Set(
  configAmbassadors.map((a) => a.name.toLowerCase().trim())
);
const ambassadorByName = new Map(
  configAmbassadors.map((a) => [a.name.toLowerCase().trim(), a])
);

/**
 * Lift fields from an ambassador entry onto a speaker entry, but never
 * overwrite something the speaker already has set explicitly in
 * `config.speakers` (the speaker config wins).
 */
function applyAmbassadorEnrichment(speaker: Speaker, amb: ConfigAmbassador) {
  speaker.nameAr ??= amb.nameAr;
  speaker.photo ??= amb.photo;
  speaker.bio ??= amb.description;
  speaker.bioAr ??= amb.descriptionAr;
  speaker.twitter ??= amb.twitter;
  speaker.twitterHandle ??= amb.twitterHandle;
  speaker.linkedin ??= amb.linkedin;
  speaker.email ??= amb.email;
}

/**
 * Build the canonical speaker list:
 *   - one entry per slug
 *   - merges config metadata with event-derived data
 *   - sorted by event count desc, then name
 */
export async function getAllSpeakers(): Promise<Speaker[]> {
  const events = await getSortedEvents();
  const nameIndex = buildSpeakerNameIndex();
  const bySlug = new Map<string, Speaker>();

  // Seed with every config-defined speaker (so a speaker page exists even if
  // they have no event references yet).
  for (const s of configSpeakers) {
    const entry: Speaker = {
      slug: s.slug,
      name: s.name,
      nameAr: s.nameAr,
      initials: s.initials || getInitials(s.name),
      bio: s.bio,
      bioAr: s.bioAr,
      photo: s.photo,
      twitter: s.twitter,
      twitterHandle: s.twitterHandle,
      linkedin: s.linkedin,
      email: s.email,
      isAmbassador: ambassadorNames.has(s.name.toLowerCase().trim()),
      events: [],
    };
    const amb = ambassadorByName.get(s.name.toLowerCase().trim());
    if (amb) applyAmbassadorEnrichment(entry, amb);
    bySlug.set(s.slug, entry);
  }

  // Walk events to attach talks and to discover speakers that aren't in config.
  for (const event of events) {
    const speakerNames = event.data.speakers ?? [];
    for (const rawName of speakerNames) {
      const trimmed = rawName.trim();
      if (!trimmed) continue;
      const cfg = nameIndex.get(trimmed.toLowerCase());
      const slug = cfg ? cfg.slug : slugify(trimmed);
      let entry = bySlug.get(slug);
      if (!entry) {
        const amb = ambassadorByName.get(trimmed.toLowerCase());
        entry = {
          slug,
          name: amb?.name ?? trimmed,
          initials: getInitials(amb?.name ?? trimmed),
          isAmbassador: ambassadorNames.has(trimmed.toLowerCase()),
          events: [],
        };
        if (amb) applyAmbassadorEnrichment(entry, amb);
        bySlug.set(slug, entry);
      }
      if (!entry.events.some((e) => e.id === event.id)) {
        entry.events.push(event);
      }
    }
  }

  return Array.from(bySlug.values()).sort((a, b) => {
    if (b.events.length !== a.events.length) return b.events.length - a.events.length;
    return a.name.localeCompare(b.name);
  });
}

export async function getSpeakerBySlug(slug: string): Promise<Speaker | undefined> {
  return (await getAllSpeakers()).find((s) => s.slug === slug);
}

/**
 * Speakers shown in the Thank You "Our Speakers" grid: every speaker who has
 * spoken at ≥1 event and is NOT also an ambassador (ambassadors are shown
 * separately on the About page).
 */
export async function getNonAmbassadorSpeakers(): Promise<Speaker[]> {
  return (await getAllSpeakers()).filter(
    (s) => !s.isAmbassador && s.events.length > 0
  );
}

const partnerCfg = config.partners as readonly {
  slug: string;
  name: string;
  nameAr: string;
  role: "official" | "community-partner" | "venue-host" | "past-community-partner";
  logo: string;
  url: string;
  description: string;
  descriptionAr: string;
  cities: readonly string[];
  eventVenues: readonly string[];
  events: readonly string[];
}[];

/**
 * Resolve a partner's event list from:
 *   - explicit `events` IDs in config
 *   - events whose `venue` matches one of `eventVenues`
 * Returns events sorted by date descending (newest first).
 */
async function resolvePartnerEvents(
  partner: (typeof partnerCfg)[number]
): Promise<EventEntry[]> {
  const all = await getSortedEvents();
  const explicit = new Set(partner.events);
  const venues = new Set(partner.eventVenues);
  const matched = all.filter((e) => {
    if (explicit.has(e.id)) return true;
    if (e.data.venue && venues.has(e.data.venue)) return true;
    return false;
  });
  return matched.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getAllPartnersWithEvents(): Promise<PartnerWithEvents[]> {
  const out: PartnerWithEvents[] = [];
  for (const p of partnerCfg) {
    out.push({
      slug: p.slug,
      name: p.name,
      nameAr: p.nameAr,
      role: p.role,
      logo: p.logo,
      url: p.url,
      description: p.description,
      descriptionAr: p.descriptionAr,
      cities: p.cities,
      events: await resolvePartnerEvents(p),
    });
  }
  return out;
}

export async function getPartnerBySlug(
  slug: string
): Promise<PartnerWithEvents | undefined> {
  const all = await getAllPartnersWithEvents();
  return all.find((p) => p.slug === slug);
}
