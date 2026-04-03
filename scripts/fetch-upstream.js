#!/usr/bin/env node

// ============================================================================
// Fetch Upstream — Try to reuse feeds from zarazhangrui/follow-builders
// ============================================================================
// Downloads feed-x.json, feed-podcasts.json, feed-blogs.json from the upstream
// repo. Writes ALL successfully fetched feeds locally (even stale ones, as a
// safety net). Exits 0 only if all feeds are fresh (today UTC); otherwise
// exits 1 so the caller can fall back to self-fetching.
// ============================================================================

import { writeFile } from 'fs/promises';

const UPSTREAM_BASE =
  'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main';

const FEEDS = ['feed-x.json', 'feed-podcasts.json', 'feed-blogs.json'];

const todayUTC = new Date().toISOString().slice(0, 10);

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function main() {
  console.log(`[upstream] checking ${UPSTREAM_BASE} for ${todayUTC} data…`);

  const results = await Promise.allSettled(
    FEEDS.map((f) => fetchJSON(`${UPSTREAM_BASE}/${f}`))
  );

  const fetched = [];
  let freshCount = 0;

  for (let i = 0; i < FEEDS.length; i++) {
    const r = results[i];
    if (r.status === 'rejected') {
      console.log(`[upstream] ✗ ${FEEDS[i]}: ${r.reason.message}`);
      continue;
    }
    const date = (r.value.generatedAt || '').slice(0, 10);
    const isFresh = date === todayUTC;
    fetched.push({ name: FEEDS[i], data: r.value });
    if (isFresh) {
      freshCount++;
      console.log(`[upstream] ✓ ${FEEDS[i]}: fresh (${date})`);
    } else {
      console.log(`[upstream] ~ ${FEEDS[i]}: stale (${date || 'unknown'}), kept as baseline`);
    }
  }

  // Write ALL fetched feeds (stale data is better than no data)
  if (fetched.length > 0) {
    await Promise.all(
      fetched.map((f) => writeFile(f.name, JSON.stringify(f.data, null, 2) + '\n'))
    );
    console.log(`[upstream] wrote ${fetched.length}/${FEEDS.length} feed(s), ${freshCount} fresh`);
  }

  // Exit 0 only if ALL feeds are fresh; otherwise fallback to self-fetch
  if (freshCount < FEEDS.length) {
    console.log('[upstream] not all feeds are fresh — falling back to self-fetch');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`[upstream] fatal: ${err.message}`);
  process.exit(1);
});
