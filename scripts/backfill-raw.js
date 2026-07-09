#!/usr/bin/env node

// ============================================================================
// Backfill Raw — Recover empty digest days from git history WITHOUT OpenAI
// ============================================================================
// For each day whose content/en/<date>.json has zero items, pull that day's
// feed-x/feed-podcasts/feed-blogs.json from its "chore: daily digest <date>"
// commit and rebuild the digest using raw tweet text as the summary (the same
// fallback remix-ai.js uses when OpenAI is down). No API key, no cost.
// zh/ja keep the English original — literal "保留原文".
//
//   node scripts/backfill-raw.js            # backfill every empty day
//   node scripts/backfill-raw.js 2026-06-29 # backfill one day
// ============================================================================

import fs from 'fs/promises';
import { readFileSync, readdirSync } from 'fs';
import { execFileSync } from 'child_process';
import { loadSiteConfig } from './lib/config.js';

const config = loadSiteConfig();
const editorial = config.editorial || {};
const MAX_BUILDERS = editorial.max_builders || 15;
const MAX_PODCASTS = editorial.max_podcasts || 2;
const MAX_BLOGS = editorial.max_blogs || 3;

function generateId(prefix, date) {
  const hash = String(prefix).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
  return `${hash}-${date}`;
}

function itemCount(dayContent) {
  return (dayContent.builderInsights?.length || 0)
    + (dayContent.podcastHighlights?.length || 0)
    + (dayContent.blogUpdates?.length || 0);
}

// Find empty days by scanning content/en.
function findEmptyDays() {
  const dir = 'content/en';
  return readdirSync(dir)
    .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map(f => f.replace('.json', ''))
    .filter(date => {
      try {
        return itemCount(JSON.parse(readFileSync(`${dir}/${date}.json`, 'utf-8'))) === 0;
      } catch {
        return false;
      }
    })
    .sort();
}

// Read a file as it existed in that day's digest commit.
function readFeedFromGit(date, filename) {
  let commit;
  try {
    commit = execFileSync('git', ['log', '--format=%H', '-1', `--grep=digest ${date}`], { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
  if (!commit) return null;
  try {
    const blob = execFileSync('git', ['show', `${commit}:${filename}`], { encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 });
    return JSON.parse(blob);
  } catch {
    return null;
  }
}

function buildBuilderItem(builder, date) {
  const tweets = (builder.tweets || []).map(t => ({
    url: t.url,
    text: t.text,
    likes: Number(t.likes) || 0,
    retweets: Number(t.retweets) || 0,
  }));
  return {
    id: generateId(builder.handle, date),
    source: 'X',
    authorName: builder.name,
    authorHandle: builder.handle,
    authorBio: builder.bio,
    title: builder.name,
    suggestedTitle: '',
    suggestedSummary: tweets.map(t => t.text).join('\n\n'),
    tweets,
    publishedAt: builder.tweets?.[0]?.createdAt || null,
    category: 'builderInsights',
  };
}

function buildPodcastItem(ep, date) {
  return {
    id: generateId(ep.url || ep.videoId || ep.title, date),
    source: ep.name,
    title: ep.title,
    url: ep.url,
    suggestedTitle: '',
    suggestedSummary: '',
    publishedAt: ep.publishedAt,
    category: 'podcastHighlights',
  };
}

function buildBlogItem(post, date) {
  return {
    id: generateId(post.url, date),
    source: post.name,
    title: post.title,
    url: post.url,
    author: post.author || null,
    suggestedTitle: '',
    suggestedSummary: '',
    publishedAt: post.publishedAt,
    category: 'blogUpdates',
  };
}

function engagement(item) {
  return (item.tweets?.[0]?.likes || 0) + (item.tweets?.[0]?.retweets || 0) * 3;
}

async function backfillDay(date) {
  const feedX = readFeedFromGit(date, 'feed-x.json');
  const feedPodcasts = readFeedFromGit(date, 'feed-podcasts.json');
  const feedBlogs = readFeedFromGit(date, 'feed-blogs.json');

  const builders = (feedX?.x || []).slice(0, MAX_BUILDERS).filter(b => b.tweets?.length);
  const podcasts = (feedPodcasts?.podcasts || []).slice(0, MAX_PODCASTS);
  const blogs = (feedBlogs?.blogs || []).slice(0, MAX_BLOGS);

  const builderInsights = builders.map(b => buildBuilderItem(b, date)).sort((a, b) => engagement(b) - engagement(a));
  const podcastHighlights = podcasts.map(p => buildPodcastItem(p, date));
  const blogUpdates = blogs.map(p => buildBlogItem(p, date));

  const total = builderInsights.length + podcastHighlights.length + blogUpdates.length;
  if (total === 0) {
    console.log(`  ${date}: no recoverable feeds in git — skipped`);
    return false;
  }

  const tweetCount = builderInsights.reduce((s, b) => s + (b.tweets?.length || 0), 0);
  const readMin = Math.max(3, Math.ceil(total * 0.5));
  const metaBase = {
    totalBuilders: builderInsights.length,
    totalTweets: tweetCount,
    totalPodcasts: podcastHighlights.length,
    totalBlogs: blogUpdates.length,
    generatedAt: new Date().toISOString(),
    backfilled: true,
  };

  // en / zh / ja share the same raw English body — "保留原文".
  const langs = {
    en: `${readMin} min`,
    zh: `${readMin} 分钟`,
    ja: `${readMin} 分`,
  };
  for (const [lang, readLabel] of Object.entries(langs)) {
    const content = {
      date,
      lang,
      summary: '',
      builderInsights,
      podcastHighlights,
      blogUpdates,
      metadata: { ...metaBase, estimatedReadTime: readLabel },
    };
    await fs.mkdir(`content/${lang}`, { recursive: true });
    await fs.writeFile(`content/${lang}/${date}.json`, JSON.stringify(content, null, 2));
  }

  console.log(`  ${date}: ${builderInsights.length} builders (${tweetCount} tweets), ${podcastHighlights.length} podcasts, ${blogUpdates.length} blogs`);
  return true;
}

async function main() {
  const arg = process.argv[2];
  const days = arg ? [arg] : findEmptyDays();
  console.log(`Backfilling ${days.length} day(s)...`);

  let done = 0;
  for (const date of days) {
    if (await backfillDay(date)) done++;
  }
  console.log(`\nDone. ${done}/${days.length} day(s) recovered.`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
