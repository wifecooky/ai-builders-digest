# AI Builders Brief

> Follow builders, not influencers.

Daily digest tracking 25+ top AI builders across X/Twitter, podcasts, and company blogs. AI-powered summarization with trilingual support (EN/ZH/JA).

**Live**: https://builders.ai.thewang.net

## Features

- **Builder Insights** — Curated tweets from top AI builders (Karpathy, Garry Tan, Guillermo Rauch, etc.)
- **Podcast Highlights** — Key takeaways from AI podcasts
- **Blog Updates** — Official blog posts from Anthropic, OpenAI, etc.
- **TL;DR Summary** — AI-generated daily summary at a glance
- **Trilingual** — English, 中文, 日本語 with one-click switching
- **Dark/Light Theme** — Cyber-themed UI with system preference support
- **Newsletter** — Daily email via Buttondown
- **RSS** — Separate feeds per language

## Quick Start

```bash
# Install dependencies
npm install && cd frontend && npm install

# Set up API key
echo "OPENAI_API_KEY=sk-..." > .env

# Generate today's content
npm run generate-daily

# Start dev server (http://localhost:5173)
cd frontend && npm run dev
```

## Architecture

Two repositories work together:

```
wifecooky/ai-builders-brief          wifecooky/ai-builders-digest
(Data Collection — 6am UTC)          (Website — 7am UTC)
━━━━━━━━━━━━━━━━━━━━━━━━━            ━━━━━━━━━━━━━━━━━━━━━━━━━

                                   try-upstream (fetch-upstream.js)
                                        │
                             ┌──── fresh? ────┐
                             yes              no
                             │                │
                      use upstream       fetch-feeds (self API)
                      feed-*.json        SociaVault / YouTube / scrape
                             │                │
                             └───┬────────────┘
                                 │
                           collect-feeds.js (read local JSON)
                                 │
                           remix-ai.js (GPT summarization)
                                 │
                           translate-ai.js (EN/ZH/JA)
                                 │
                           content/{en,zh,ja}/*.json
                                 │
                           SvelteKit static build
                                 │
                           Cloudflare Pages (auto-deploy on push)
```

### Data Pipeline

```bash
npm run generate-daily    # Full pipeline: try-upstream → collect → remix → translate
npm run try-upstream      # Upstream-first: reuse zarazhangrui/follow-builders feeds, fallback to self API
npm run fetch-feeds       # Direct self-fetch (SociaVault, YouTube, blog scrape)
npm run collect           # Read local feed-*.json
npm run remix             # AI summarization (GPT-5.4-mini)
npm run translate         # Translate to zh/ja
```

> **Upstream-first strategy**: `try-upstream` fetches today's feeds from the upstream repo ([zarazhangrui/follow-builders](https://github.com/zarazhangrui/follow-builders)). If the data is fresh (same UTC date), it's used directly — saving API credits. If stale or unavailable, `fetch-feeds` runs as fallback.

## Project Structure

```
├── site.yaml              # Site config (identity, theme, labels, sources)
├── .env                   # API keys (not committed)
├── frontend/              # SvelteKit + Tailwind CSS v4
│   ├── src/routes/        # Pages, RSS, sitemap, 404
│   ├── src/lib/           # Components (BuilderCard, PodcastCard, etc.)
│   └── static/            # Favicons, OG image
├── scripts/               # Data pipeline
│   ├── fetch-upstream.js  # Upstream-first feed fetcher (fallback to self API)
│   ├── collect-feeds.js   # Read local feed-*.json
│   ├── remix-ai.js        # AI summarization + editorial
│   ├── translate-ai.js    # Trilingual translation
│   ├── generate-weekly.js # Weekly trend report
│   └── send-newsletter.js # Buttondown newsletter
├── content/               # Generated content (en/zh/ja)
├── config/                # Editorial prompts, trend terms
└── .github/workflows/     # Daily automation (GitHub Actions)
```

## Automation

| Schedule | Repo | Workflow | What it does |
|----------|------|----------|--------------|
| 6am UTC | `ai-builders-brief` | Generate Feeds | Fetch tweets (SociaVault), podcasts (YouTube), blogs (scrape) |
| 7am UTC | `ai-builders-digest` | Daily Digest | Collect feeds → GPT remix → translate → push → Cloudflare deploy |

### Required Secrets

| Secret | Repo | Purpose |
|--------|------|---------|
| `SOCIAVAULT_API_KEY` | ai-builders-brief | X/Twitter data via SociaVault |
| `SUPADATA_API_KEY` | ai-builders-brief | YouTube transcript API |
| `OPENAI_API_KEY` | ai-builders-digest | GPT summarization & translation |

## Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5 (runes) + Tailwind CSS v4
- **AI**: OpenAI GPT-5.4-mini (summarization + translation)
- **X Data**: SociaVault API (profile + timeline)
- **Hosting**: Cloudflare Pages (static, adapter-static)
- **Newsletter**: Buttondown
- **CI/CD**: GitHub Actions

## License

MIT
