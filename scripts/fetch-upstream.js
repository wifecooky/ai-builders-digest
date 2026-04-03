#!/usr/bin/env node

// ============================================================================
// Fetch Upstream — Try to reuse feeds from zarazhangrui/follow-builders
// ============================================================================
// Downloads feed-x.json, feed-podcasts.json, feed-blogs.json from the upstream
// repo. If today's data (UTC) is available, writes it locally and exits 0.
// Otherwise exits 1 so the caller can fall back to self-fetching.
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

  const fresh = [];
  for (let i = 0; i < FEEDS.length; i++) {
    const r = results[i];
    if (r.status === 'rejected') {
      console.log(`[upstream] ✗ ${FEEDS[i]}: ${r.reason.message}`);
      continue;
    }
    const date = (r.value.generatedAt || '').slice(0, 10);
    if (date === todayUTC) {
      fresh.push({ name: FEEDS[i], data: r.value });
      console.log(`[upstream] ✓ ${FEEDS[i]}: fresh (${date})`);
    } else {
      console.log(`[upstream] ✗ ${FEEDS[i]}: stale (${date || 'unknown'})`);
    }
  }

  if (fresh.length === 0) {
    console.log('[upstream] no fresh feeds — falling back to self-fetch');
    process.exit(1);
  }

  await Promise.all(
    fresh.map((f) => writeFile(f.name, JSON.stringify(f.data, null, 2) + '\n'))
  );
  console.log(`[upstream] wrote ${fresh.length}/${FEEDS.length} feed(s)`);
}

main().catch((err) => {
  console.error(`[upstream] fatal: ${err.message}`);
  process.exit(1);
});
