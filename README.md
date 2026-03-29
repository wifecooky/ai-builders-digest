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

## Data Pipeline

```
collect → remix → translate
  │         │         │
  │         │         └─ AI translates to zh/ja with native-quality prompts
  │         └─ AI generates editorial headlines + summaries
  └─ Fetches curated feeds from GitHub JSON sources
```

```bash
npm run generate-daily    # Full pipeline
npm run collect           # Fetch RSS feeds
npm run remix             # AI summarization (gpt-4o)
npm run translate         # Translate to en/zh/ja
npm run generate-weekly   # Weekly trend report
```

## Project Structure

```
├── site.yaml              # Site config (identity, theme, labels, sources)
├── .env                   # API keys (not committed)
├── frontend/              # SvelteKit + Tailwind CSS v4
│   ├── src/routes/        # Pages, RSS, sitemap, 404
│   ├── src/lib/           # Components (BuilderCard, PodcastCard, etc.)
│   └── static/            # Favicons, OG image
├── scripts/               # Data pipeline
│   ├── collect-feeds.js   # Fetch from GitHub JSON feeds
│   ├── remix-ai.js        # AI summarization + editorial
│   ├── translate-ai.js    # Trilingual translation
│   ├── generate-weekly.js # Weekly trend report
│   └── send-newsletter.js # Buttondown newsletter
├── content/               # Generated content (en/zh/ja)
├── config/                # Editorial prompts, trend terms
└── .github/workflows/     # Daily automation (GitHub Actions)
```

## Automation

Daily content is generated automatically via GitHub Actions at UTC 07:00. See `.github/workflows/daily.yml`.

## Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5 (runes) + Tailwind CSS v4
- **AI**: OpenAI gpt-4o (summarization + translation)
- **Hosting**: Static site (adapter-static)
- **Newsletter**: Buttondown
- **CI/CD**: GitHub Actions

## License

MIT
