# CLAUDE.md — CursorSaudi.com

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Sync events from ~/Vault (soft) → astro dev on localhost:4321
pnpm sync-events      # Manually run the bidirectional Vault ↔ repo sync
pnpm build            # Production build → ./dist (no sync; uses committed markdown)
pnpm preview          # Preview production build
```

Always use `pnpm dev` (not `npx astro dev`) — it triggers the event sync first.

## Architecture

Astro 5 static site, single page (`src/pages/index.astro`). Bilingual (Arabic RTL default, English LTR) with client-side `localStorage` toggle. Dark mode only — no theme switcher.

### Stack

- **Framework**: Astro 5 (static SSG)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin (configured in `astro.config.ts`)
- **TypeScript**: Strict mode (`astro/tsconfigs/strict`)
- **Package manager**: pnpm
- **Deployment**: GitHub Pages via Actions (pnpm v9, Node 20) on push to `main`

### Path alias

`@/*` → `./src/*` (configured in `tsconfig.json`)

## Project Structure

```
src/
├── pages/index.astro          # Single page assembling all sections
├── layouts/Layout.astro       # Base HTML shell (dark mode, RTL/LTR, meta)
├── components/                # Astro components (Header, Hero, EventTimeline, EventCard, Partners, Footer, LangToggle)
├── config.ts                  # Site metadata, social links, ambassadors, partners (single source of truth)
├── content.config.ts          # Zod schema for event content collection
├── data/events/*.md           # Event markdown files (frontmatter-driven)
├── i18n/{ar,en}.json          # UI translation strings
├── i18n/index.ts              # getTranslation(lang, key) and t(lang, key) helpers
├── utils/events.ts            # getSortedEvents, getUpcomingEvents, getPastEvents, getEventsByStatus
└── styles/global.css          # Tailwind imports, dark theme CSS variables
public/
├── toggle-lang.js             # Runs before hydration to set <html dir/lang> from localStorage
└── CNAME                      # cursorsaudi.com
```

## Content Collections

Events live in `src/data/events/` as Markdown files. Schema defined in `src/content.config.ts` with Zod:

- **Required**: `title`, `date`, `location`, `description`, `type` (`"meetup" | "hackathon" | "workshop" | "build"`), `status` (`"backlog" | "informed" | "venue-pending" | "register-open" | "register-closed" | "concluded" | "canceled"`)
- **Optional**: `titleAr`, `locationAr`, `descriptionAr`, `lumaUrl`, `speakers`, `slides`, `venue`, `photos`, `videos`, `coverPhoto`

`status` drives UI behavior: register buttons show only for `register-open`, canceled events are muted/strikethrough, and status badges are color-coded on EventCards. Access events only through `src/utils/events.ts` helpers.

### Vault ↔ repo bidirectional sync

`scripts/sync-events.mjs` keeps `src/data/events/` and `public/events/` in sync with the maintainer's Obsidian Vault at `~/Vault/cursorsaudi/events/` (markdown) and `~/Vault/__media/` (images/videos). Key behaviors:

- **Bidirectional**: new files on either side propagate to the other. For files that exist on both sides, content is compared after applying the Vault → repo transform; only genuine differences trigger a sync, with newer mtime winning conflicts. After every sync the two sides' mtimes are aligned so subsequent runs see them as in-sync.
- **Vault → repo transformations**: strips Obsidian-only fields (`created`, `modified`, `status_obs`, `published`); converts `![[file]]` wikilinks to `![](/events/<slug>/<file>)`; populates `photos`/`videos`/`coverPhoto` from referenced media; applies fallbacks for required fields when the Vault has incomplete drafts (slug→title-case, filename→date, invalid `type`→`meetup`, invalid `status`→`backlog`); copies referenced media from `~/Vault/__media/` into `public/events/<slug>/`.
- **Repo → vault transformations**: strips auto-generated fields (`photos`, `coverPhoto`, `videos`); converts markdown image links back to wikilinks; preserves any existing `created`/`modified` fields on the Vault destination so Obsidian metadata isn't clobbered; copies media back to `~/Vault/__media/` (warns on flat-folder name collisions).
- **Soft mode** (`--soft`): used by `pnpm dev` so the script silently exits when `~/Vault` isn't present (CI machines, contributors without the Vault).
- **CI**: GitHub Actions builds straight from the committed markdown — no sync, no Vault checkout. The Vault dependency is purely a local convenience.
- **Manual override flags**: `--vault-wins`, `--repo-wins`, `--dry-run`, `--vault-path <path>`.

**Never** commit to `src/data/events/` or `public/events/` directly without running `pnpm sync-events` first if the Vault is reachable — otherwise the next sync will see drift and may overwrite the freshly-committed file.

## i18n

- JSON translation files: `src/i18n/ar.json`, `src/i18n/en.json`
- `public/toggle-lang.js` sets `<html dir>` and `lang` from `localStorage` before render (prevents layout flash)
- Components call `getTranslation(lang, key)` or `t(lang, key)` from `src/i18n/index.ts`

## Design Tokens (Dark Only)

- Background: `#0d1117` | Surface: `#161b22` | Border: `#30363d`
- Primary text: `#e6edf3` | Secondary: `#8b949e`
- Accent: `#58a6ff` | Accent hover: `#79c0ff`

## Conventions

- Components are stateless: props in, HTML out, no side effects
- Prefer pure functions in `utils/`
- `src/config.ts` is the single source of truth for site metadata, social links, and partners
- All content collection access goes through `src/utils/events.ts`
- `EventTimeline` is the single events section — highlights next upcoming + latest past event at top, remaining events below grouped by upcoming/past. No event duplication.
- Partners are configured in `src/config.ts` and rendered by `src/components/Partners.astro`
