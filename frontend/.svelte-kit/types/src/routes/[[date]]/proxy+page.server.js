// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { error } from '@sveltejs/kit';

const CONTENT_DIR = path.resolve('../content');

function loadContent(lang, date) {
  const filePath = path.join(CONTENT_DIR, lang, `${date}.json`);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function getAvailableDates() {
  const enDir = path.join(CONTENT_DIR, 'en');
  try {
    return fs.readdirSync(enDir)
      .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map(f => f.replace('.json', ''))
      .sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
}

export const prerender = true;

export function entries() {
  const dates = getAvailableDates();
  return [
    { date: '' },
    ...dates.map(d => ({ date: d }))
  ];
}

/** @param {Parameters<import('./$types').PageServerLoad>[0]} event */
export function load({ params }) {
  const dates = getAvailableDates();
  const latest = dates[0] || new Date().toISOString().split('T')[0];
  const date = params.date || latest;

  if (params.date && !dates.includes(params.date)) {
    error(404, 'Not found');
  }

  return {
    date,
    latest,
    dates,
    content: {
      en: loadContent('en', date),
      zh: loadContent('zh', date),
      ja: loadContent('ja', date)
    }
  };
}
