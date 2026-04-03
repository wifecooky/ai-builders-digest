import fs from 'fs/promises';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');

function loadLocalJSON(filename, label) {
  const filePath = path.join(ROOT, filename);
  console.log(`Loading ${label}...`);
  try {
    if (!existsSync(filePath)) {
      console.error(`  ${filename} not found`);
      return null;
    }
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`  Failed to load ${label}: ${err.message}`);
    return null;
  }
}

async function main() {
  const feedX = loadLocalJSON('feed-x.json', 'X/Twitter feed');
  const feedPodcasts = loadLocalJSON('feed-podcasts.json', 'Podcasts feed');
  const feedBlogs = loadLocalJSON('feed-blogs.json', 'Blogs feed');

  const builders = feedX?.x || [];
  const podcasts = feedPodcasts?.podcasts || [];
  const blogs = feedBlogs?.blogs || [];

  const tweetCount = builders.reduce((s, b) => s + (b.tweets?.length || 0), 0);

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
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
