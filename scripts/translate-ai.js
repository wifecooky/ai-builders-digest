import fs from 'fs/promises';
import OpenAI from 'openai';

const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 1000;
const CRITICAL_FAILURE_THRESHOLD = 0.5;
const MIN_ATTEMPTS_FOR_ABORT = 5;
const TRANSLATION_MAX_TOKENS = 1000;
const TRANSLATION_TEMPERATURE = 0.3;

function createOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function translateArticle(article, targetLang) {
  const langName = targetLang === 'zh' ? 'Chinese (Simplified)' : 'Japanese';

  const hasSuggested = article.suggestedTitle || article.suggestedSummary;
  const fields = hasSuggested
    ? `Title: ${article.title}
EditorialTitle: ${article.suggestedTitle || article.title}
EditorialSummary: ${article.suggestedSummary || ''}`
    : `Title: ${article.title}`;

  const outputSpec = hasSuggested
    ? `{ "title": "translated title", "suggestedTitle": "translated editorial title", "suggestedSummary": "translated editorial summary" }`
    : `{ "title": "translated title" }`;

  const prompt = `Translate this AI digest content to ${langName}. Keep technical terms in English (AI, LLM, GPU, API, agent, token, prompt, etc.). Keep proper nouns (names, companies, products) in English. Keep all URLs unchanged. The translation should sound natural, not like a translation.

${fields}

Output JSON:
${outputSpec}`;

  try {
    const openai = createOpenAIClient();
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: TRANSLATION_TEMPERATURE,
      max_tokens: TRANSLATION_MAX_TOKENS,
    });

    const translated = JSON.parse(response.choices[0].message.content);

    const result = { ...article, title: translated.title };
    if (translated.suggestedTitle) result.suggestedTitle = translated.suggestedTitle;
    if (translated.suggestedSummary) result.suggestedSummary = translated.suggestedSummary;
    return result;
  } catch (error) {
    console.error(`Translation failed for ${article.id} to ${targetLang}: ${error.message}`);
    return null;
  }
}

export async function translateBatch(articles, targetLang) {
  console.log(`Translating ${articles.length} items to ${targetLang}...`);
  const results = [];
  let totalProcessed = 0;
  let totalFailed = 0;

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(article => translateArticle(article, targetLang))
    );

    const successes = batchResults.filter(r => r !== null);
    const failures = batchResults.length - successes.length;
    results.push(...successes);
    totalProcessed += batchResults.length;
    totalFailed += failures;

    const failureRate = totalFailed / totalProcessed;
    if (failureRate > CRITICAL_FAILURE_THRESHOLD && totalProcessed >= MIN_ATTEMPTS_FOR_ABORT) {
      throw new Error(`Translation failure rate too high: ${totalFailed}/${totalProcessed}`);
    }

    if (i + BATCH_SIZE < articles.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  console.log(`  Translated ${results.length}/${articles.length}`);
  return results;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  await import('dotenv/config');

  const inputPath = 'content/remixed-articles.json';
  console.log(`Loading from ${inputPath}...`);
  const data = JSON.parse(await fs.readFile(inputPath, 'utf-8'));
  const today = data.date || new Date().toISOString().split('T')[0];

  const allItems = [
    ...(data.builderInsights || []),
    ...(data.podcastHighlights || []),
    ...(data.blogUpdates || []),
  ];
  const totalCount = allItems.length;

  // English version (no translation needed)
  const enContent = {
    date: today,
    lang: 'en',
    builderInsights: data.builderInsights || [],
    podcastHighlights: data.podcastHighlights || [],
    blogUpdates: data.blogUpdates || [],
    metadata: {
      ...data.metadata,
      estimatedReadTime: `${Math.max(3, Math.ceil(totalCount * 0.5))} min`,
      generatedAt: new Date().toISOString(),
    },
  };

  await fs.mkdir('content/en', { recursive: true });
  await fs.writeFile(`content/en/${today}.json`, JSON.stringify(enContent, null, 2));
  console.log(`Saved English: content/en/${today}.json`);

  // Chinese
  console.log('\nTranslating to Chinese...');
  const zhBuilders = await translateBatch(data.builderInsights || [], 'zh');
  const zhPodcasts = await translateBatch(data.podcastHighlights || [], 'zh');
  const zhBlogs = await translateBatch(data.blogUpdates || [], 'zh');

  const zhContent = {
    date: today,
    lang: 'zh',
    builderInsights: zhBuilders,
    podcastHighlights: zhPodcasts,
    blogUpdates: zhBlogs,
    metadata: { ...data.metadata, estimatedReadTime: `${Math.max(3, Math.ceil(totalCount * 0.5))} 分钟`, generatedAt: new Date().toISOString() },
  };

  await fs.mkdir('content/zh', { recursive: true });
  await fs.writeFile(`content/zh/${today}.json`, JSON.stringify(zhContent, null, 2));
  console.log(`Saved Chinese: content/zh/${today}.json`);

  // Japanese
  console.log('\nTranslating to Japanese...');
  const jaBuilders = await translateBatch(data.builderInsights || [], 'ja');
  const jaPodcasts = await translateBatch(data.podcastHighlights || [], 'ja');
  const jaBlogs = await translateBatch(data.blogUpdates || [], 'ja');

  const jaContent = {
    date: today,
    lang: 'ja',
    builderInsights: jaBuilders,
    podcastHighlights: jaPodcasts,
    blogUpdates: jaBlogs,
    metadata: { ...data.metadata, estimatedReadTime: `${Math.max(3, Math.ceil(totalCount * 0.5))} 分`, generatedAt: new Date().toISOString() },
  };

  await fs.mkdir('content/ja', { recursive: true });
  await fs.writeFile(`content/ja/${today}.json`, JSON.stringify(jaContent, null, 2));
  console.log(`Saved Japanese: content/ja/${today}.json`);

  console.log('\nTranslation complete!');
}
