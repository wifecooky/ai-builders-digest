import fs from 'fs/promises';
import { loadSiteConfig } from './lib/config.js';

const config = loadSiteConfig();
const feeds = config.sources.feeds;

async function fetchJSON(url, label) {
  console.log(`Fetching ${label}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch ${label}: ${err.message}`);
    return null;
  }
}

async function main() {
  const [feedX, feedPodcasts, feedBlogs] = await Promise.all([
    fetchJSON(feeds.x, 'X/Twitter feed'),
    fetchJSON(feeds.podcasts, 'Podcasts feed'),
    fetchJSON(feeds.blogs, 'Blogs feed'),
  ]);

  const builders = feedX?.x || [];
  const podcasts = feedPodcasts?.podcasts || [];
  const blogs = feedBlogs?.blogs || [];

  const tweetCount = builders.reduce((s, b) => s + (b.tweets?.length || 0), 0);

  // Check feed freshness
  const feedAge = feedX?.generatedAt
    ? (Date.now() - new Date(feedX.generatedAt).getTime()) / (1000 * 60 * 60)
    : null;
  if (feedAge && feedAge > 48) {
    console.warn(`Warning: X feed is ${feedAge.toFixed(0)}h old`);
  }

  const output = {
    date: new Date().toISOString().split('T')[0],
    builders,
    podcasts,
    blogs,
    stats: {
      builderCount: builders.length,
      tweetCount,
      podcastCount: podcasts.length,
      blogCount: blogs.length,
      feedGeneratedAt: feedX?.generatedAt || null,
    },
  };

  await fs.mkdir('content', { recursive: true });
  await fs.writeFile('content/raw-feeds.json', JSON.stringify(output, null, 2));

  console.log(`\nCollected: ${builders.length} builders (${tweetCount} tweets), ${podcasts.length} podcasts, ${blogs.length} blogs`);
  console.log('Saved to content/raw-feeds.json');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
