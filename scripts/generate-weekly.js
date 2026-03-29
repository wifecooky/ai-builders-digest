import fs from 'fs/promises';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const PROMPT_TEMPLATE = readFileSync(resolve('config/prompts/weekly-trends.md'), 'utf-8');

function loadTermList() {
  return JSON.parse(readFileSync(resolve('config/trend-terms.json'), 'utf-8'));
}

export function countTerms(articles, termList) {
  const allTerms = [...termList.companies, ...termList.models, ...termList.technical_terms];
  const counts = new Map();

  for (const article of articles) {
    const text = `${article.suggestedTitle || ''} ${article.suggestedSummary || ''}`;
    for (const term of allTerms) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`\\b${escaped}\\b`, 'gi');
      const matches = text.match(re);
      if (matches) {
        const key = term.toLowerCase();
        counts.set(key, (counts.get(key) || 0) + matches.length);
      }
    }
  }

  return counts;
}

export function findRisingTerms(thisWeek, lastWeek) {
  const rising = [];
  for (const [term, count] of thisWeek) {
    const prev = lastWeek.get(term) || 0;
    const delta = count - prev;
    const emerging = prev <= 1 && count >= 3;
    if (delta >= 2 || emerging) {
      rising.push({ term, count, prev, delta, emerging });
    }
  }
  return rising.sort((a, b) => b.delta - a.delta);
}

export function buildHot10(articles) {
  return [...articles]
    .sort((a, b) => {
      const scoreA = (a.tweets?.[0]?.likes || 0) + (a.tweets?.[0]?.retweets || 0) * 3;
      const scoreB = (b.tweets?.[0]?.likes || 0) + (b.tweets?.[0]?.retweets || 0) * 3;
      return scoreB - scoreA;
    })
    .slice(0, 10)
    .map(a => ({
      title: a.suggestedTitle || a.title,
      author: a.authorName || a.source,
      score: (a.tweets?.[0]?.likes || 0) + (a.tweets?.[0]?.retweets || 0) * 3,
    }));
}

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7) + 1;
}

async function loadWeekArticles(endDate) {
  const all = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    try {
      const content = await fs.readFile(`content/en/${dateStr}.json`, 'utf-8');
      const data = JSON.parse(content);
      all.push(...(data.builderInsights || []));
      all.push(...(data.podcastHighlights || []));
      all.push(...(data.blogUpdates || []));
    } catch {
      continue;
    }
  }

  return all;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await import('dotenv/config');
  const { default: OpenAI } = await import('openai');

  const today = new Date();
  const weekNum = getWeekNumber(today);
  const weekId = `${today.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;

  console.log(`Generating weekly report for ${weekId}...`);

  const termList = loadTermList();
  const thisWeekArticles = await loadWeekArticles(today);

  const prevEnd = new Date(today);
  prevEnd.setDate(prevEnd.getDate() - 7);
  const prevWeekArticles = await loadWeekArticles(prevEnd);

  if (thisWeekArticles.length === 0) {
    console.log('No articles found for this week. Skipping.');
    process.exit(0);
  }

  console.log(`  ${thisWeekArticles.length} articles this week, ${prevWeekArticles.length} last week`);

  const thisWeekCounts = countTerms(thisWeekArticles, termList);
  const prevWeekCounts = countTerms(prevWeekArticles, termList);
  const rising = findRisingTerms(thisWeekCounts, prevWeekCounts);
  const hot10 = buildHot10(thisWeekArticles);

  console.log(`  Rising terms: ${rising.slice(0, 10).map(t => t.term).join(', ') || 'none'}`);

  const risingText = rising.slice(0, 10)
    .map(t => `- ${t.term}: ${t.count} mentions (${t.prev} last week)${t.emerging ? ' [EMERGING]' : ''}`)
    .join('\n');

  const termArticlesText = rising.slice(0, 10)
    .map(t => {
      const articles = thisWeekArticles
        .filter(a => `${a.suggestedTitle || ''} ${a.suggestedSummary || ''}`.toLowerCase().includes(t.term))
        .slice(0, 3)
        .map(a => `  - ${a.authorName || a.source}: ${a.suggestedTitle || a.title}`)
        .join('\n');
      return `${t.term}:\n${articles}`;
    })
    .join('\n\n');

  const featuredText = thisWeekArticles
    .map(a => `- ${a.authorName || a.source}: ${a.suggestedTitle || a.title} — ${a.suggestedSummary || ''}`)
    .join('\n');

  const prompt = PROMPT_TEMPLATE
    .replace('{{RISING_TERMS}}', risingText || 'No significant changes')
    .replace('{{TERM_ARTICLES}}', termArticlesText || 'N/A')
    .replace('{{FEATURED_SUMMARIES}}', featuredText || 'N/A');

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 4000,
    });

    const aiResult = JSON.parse(response.choices[0].message.content);

    const weeklyReport = {
      weekId,
      date: today.toISOString().split('T')[0],
      lang: 'en',
      week_overview: aiResult.week_overview,
      trends: aiResult.trends || [],
      hot10,
      metadata: {
        totalArticles: thisWeekArticles.length,
        risingTermsCount: rising.length,
        generatedAt: new Date().toISOString(),
      },
    };

    await fs.mkdir('content/en/weekly', { recursive: true });
    await fs.writeFile(`content/en/weekly/${weekId}.json`, JSON.stringify(weeklyReport, null, 2));
    console.log(`\nSaved: content/en/weekly/${weekId}.json`);
  } catch (error) {
    console.error('Weekly report generation failed:', error.message);
    process.exit(1);
  }
}
