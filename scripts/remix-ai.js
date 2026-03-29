import fs from 'fs/promises';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import OpenAI from 'openai';
import { loadSiteConfig } from './lib/config.js';

const config = loadSiteConfig();
const editorial = config.editorial || {};

const PROMPTS = {
  tweets: readFileSync(resolve('config/prompts/summarize-tweets.md'), 'utf-8'),
  podcast: readFileSync(resolve('config/prompts/summarize-podcast.md'), 'utf-8'),
  blogs: readFileSync(resolve('config/prompts/summarize-blogs.md'), 'utf-8'),
};

const BATCH_DELAY_MS = 500;

let openai;
let model;

function ensureClient() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    model = process.env.OPENAI_MODEL || 'gpt-4o';
  }
}

function generateId(prefix, date) {
  const hash = prefix.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
  return `${hash}-${date}`;
}

async function callAI(systemPrompt, userContent) {
  ensureClient();
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: JSON.stringify(userContent) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 2000,
  });
  return JSON.parse(response.choices[0].message.content);
}

async function remixBuilder(builder, date) {
  if (!builder.tweets?.length) return null;

  try {
    const result = await callAI(PROMPTS.tweets, {
      name: builder.name,
      bio: builder.bio,
      tweets: builder.tweets.map(t => ({
        text: t.text,
        url: t.url,
        likes: t.likes,
        retweets: t.retweets,
        isQuote: t.isQuote,
      })),
    });

    if (result.skip) {
      console.log(`  Skipped ${builder.name} (no substance)`);
      return null;
    }

    return {
      id: generateId(builder.handle, date),
      source: 'X',
      authorName: builder.name,
      authorHandle: builder.handle,
      authorBio: builder.bio,
      title: builder.name,
      suggestedTitle: result.headline,
      suggestedSummary: result.body,
      tweets: builder.tweets.map(t => ({
        url: t.url,
        text: t.text,
        likes: t.likes,
        retweets: t.retweets,
      })),
      publishedAt: builder.tweets[0].createdAt,
      category: 'builderInsights',
    };
  } catch (err) {
    console.error(`  Failed to remix ${builder.name}: ${err.message}`);
    return null;
  }
}

async function remixPodcast(episode, date) {
  try {
    const result = await callAI(PROMPTS.podcast, {
      name: episode.name,
      title: episode.title,
      transcript: episode.transcript?.slice(0, 30000) || '',
    });

    return {
      id: generateId(episode.url || episode.videoId, date),
      source: episode.name,
      title: episode.title,
      url: episode.url,
      suggestedTitle: result.headline,
      suggestedSummary: result.body,
      publishedAt: episode.publishedAt,
      category: 'podcastHighlights',
    };
  } catch (err) {
    console.error(`  Failed to remix podcast ${episode.title}: ${err.message}`);
    return null;
  }
}

async function remixBlog(post, date) {
  try {
    const result = await callAI(PROMPTS.blogs, {
      name: post.name,
      title: post.title,
      content: post.content?.slice(0, 20000) || post.description || '',
      author: post.author || null,
    });

    return {
      id: generateId(post.url, date),
      source: post.name,
      title: post.title,
      url: post.url,
      author: post.author || null,
      suggestedTitle: result.headline,
      suggestedSummary: result.body,
      publishedAt: post.publishedAt,
      category: 'blogUpdates',
    };
  } catch (err) {
    console.error(`  Failed to remix blog ${post.title}: ${err.message}`);
    return null;
  }
}

async function main() {
  const raw = JSON.parse(await fs.readFile('content/raw-feeds.json', 'utf-8'));
  const date = raw.date;
  const maxBuilders = editorial.max_builders || 15;
  const maxPodcasts = editorial.max_podcasts || 2;
  const maxBlogs = editorial.max_blogs || 3;

  // 1. Remix builders
  console.log(`Remixing ${raw.builders.length} builders...`);
  const builderInsights = [];
  const builders = raw.builders.slice(0, maxBuilders);

  for (let i = 0; i < builders.length; i++) {
    const insight = await remixBuilder(builders[i], date);
    if (insight) builderInsights.push(insight);
    if (i < builders.length - 1) {
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
    }
  }
  console.log(`  ${builderInsights.length} builder insights generated`);

  // 2. Remix podcasts
  console.log(`Remixing ${raw.podcasts.length} podcasts...`);
  const podcastHighlights = [];
  const podcasts = raw.podcasts.slice(0, maxPodcasts);

  for (const episode of podcasts) {
    const highlight = await remixPodcast(episode, date);
    if (highlight) podcastHighlights.push(highlight);
  }
  console.log(`  ${podcastHighlights.length} podcast highlights generated`);

  // 3. Remix blogs
  console.log(`Remixing ${raw.blogs.length} blogs...`);
  const blogUpdates = [];
  const blogs = raw.blogs.slice(0, maxBlogs);

  for (const post of blogs) {
    const update = await remixBlog(post, date);
    if (update) blogUpdates.push(update);
  }
  console.log(`  ${blogUpdates.length} blog updates generated`);

  // 4. Merge into unified feed sorted by engagement
  const allItems = [
    ...builderInsights,
    ...podcastHighlights,
    ...blogUpdates,
  ].sort((a, b) => {
    const scoreA = (a.tweets?.[0]?.likes || 0) + (a.tweets?.[0]?.retweets || 0) * 3;
    const scoreB = (b.tweets?.[0]?.likes || 0) + (b.tweets?.[0]?.retweets || 0) * 3;
    return scoreB - scoreA;
  });

  // 5. Generate daily summary
  console.log('Generating daily summary...');
  let dailySummary = '';
  try {
    ensureClient();
    const headlines = allItems.map(a => `- ${a.authorName || a.source}: ${a.suggestedTitle}`).join('\n');
    const summaryResp = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'Write a 2-3 sentence overview of today\'s AI builder activity. Be conversational, specific, and punchy — name names, state claims directly. Use past tense or active voice ("Karpathy found...", "Rauch shipped..."), not present progressive ("is highlighting..."). No intro like "Today in AI...". Just jump straight in. Under 280 chars.' },
        { role: 'user', content: headlines },
      ],
      temperature: 0.5,
      max_tokens: 200,
    });
    dailySummary = summaryResp.choices[0].message.content.trim();
    console.log(`  Summary: ${dailySummary}`);
  } catch (err) {
    console.error(`  Summary generation failed: ${err.message}`);
  }

  const output = {
    date,
    summary: dailySummary,
    items: allItems,
    metadata: {
      totalBuilders: raw.stats.builderCount,
      totalTweets: raw.stats.tweetCount,
      totalPodcasts: raw.stats.podcastCount,
      totalBlogs: raw.stats.blogCount,
      generatedAt: new Date().toISOString(),
    },
  };

  await fs.writeFile('content/remixed-articles.json', JSON.stringify(output, null, 2));
  console.log('\nSaved to content/remixed-articles.json');
}

await import('dotenv/config');
main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
