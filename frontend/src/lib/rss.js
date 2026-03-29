import fs from 'fs';
import path from 'path';
import config from 'virtual:site-config';

const CONTENT_DIR = path.resolve('../content');
const SITE_URL = config.site.url;

const LANG_CONFIG = {
  en: { title: config.site.title.en, desc: config.site.subtitle.en, lang: 'en', file: 'rss.xml' },
  zh: { title: config.site.title.zh, desc: config.site.subtitle.zh, lang: 'zh-CN', file: 'rss-zh.xml' },
  ja: { title: config.site.title.ja, desc: config.site.subtitle.ja, lang: 'ja', file: 'rss-ja.xml' },
};

const SECTION_LABELS = {
  en: { builders: 'Builder Insights', podcasts: 'Podcast Highlights', blogs: 'Blog Updates' },
  zh: { builders: '实干者说', podcasts: '播客精选', blogs: '官方博客' },
  ja: { builders: 'ビルダーの声', podcasts: 'ポッドキャスト', blogs: '公式ブログ' },
};

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

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateRss(lang) {
  const cfg = LANG_CONFIG[lang] || LANG_CONFIG.en;
  const labels = SECTION_LABELS[lang] || SECTION_LABELS.en;
  const dates = getAvailableDates().slice(0, 30);
  const items = [];
  const readMoreText = config.labels.cta;

  for (const date of dates) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, lang, `${date}.json`), 'utf-8'));
      const pubDate = new Date(date + 'T08:00:00Z').toUTCString();

      const html = [];

      if (data.builderInsights?.length) {
        html.push(`<h3>${labels.builders}</h3>`);
        for (const a of data.builderInsights) {
          const title = a.suggestedTitle || a.title;
          const summary = a.suggestedSummary || '';
          html.push(`<p><strong>${escapeXml(a.authorName)}</strong>: ${escapeXml(title)}</p>`);
          if (summary) html.push(`<p>${escapeXml(summary)}</p>`);
        }
      }

      if (data.builderInsights?.length && (data.podcastHighlights?.length || data.blogUpdates?.length)) {
        html.push('<hr>');
      }

      if (data.podcastHighlights?.length) {
        html.push(`<h3>${labels.podcasts}</h3>`);
        for (const a of data.podcastHighlights) {
          const title = a.suggestedTitle || a.title;
          const link = a.url ? `<a href="${escapeXml(a.url)}">${escapeXml(title)}</a>` : escapeXml(title);
          html.push(`<p>${link}</p>`);
          if (a.suggestedSummary) html.push(`<p>${escapeXml(a.suggestedSummary)}</p>`);
        }
      }

      if (data.blogUpdates?.length) {
        if (data.podcastHighlights?.length) html.push('<hr>');
        html.push(`<h3>${labels.blogs}</h3>`);
        for (const a of data.blogUpdates) {
          const title = a.suggestedTitle || a.title;
          const link = a.url ? `<a href="${escapeXml(a.url)}">${escapeXml(title)}</a>` : escapeXml(title);
          const src = a.source ? ` <small>[${escapeXml(a.source)}]</small>` : '';
          html.push(`<p>${link}${src}</p>`);
          if (a.suggestedSummary) html.push(`<p>${escapeXml(a.suggestedSummary)}</p>`);
        }
      }

      html.push('<hr>');
      html.push(`<p><a href="${SITE_URL}/${date}">${readMoreText[lang] || readMoreText.en}</a></p>`);

      items.push(`    <item>
      <title>${escapeXml(`${cfg.title} — ${date}`)}</title>
      <link>${SITE_URL}/${date}</link>
      <guid isPermaLink="true">${SITE_URL}/${date}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${html.join('\n')}]]></description>
    </item>`);
    } catch {
      continue;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${cfg.title}</title>
    <description>${escapeXml(cfg.desc)}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/${cfg.file}" rel="self" type="application/rss+xml"/>
    <language>${cfg.lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>`;
}
