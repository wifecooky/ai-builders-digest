<script>
  import { getContext } from 'svelte';
  import config from '$lib/site-config.js';
  import SubscribeForm from '$lib/components/SubscribeForm.svelte';

  const app = getContext('app');
  let currentLang = $derived(app.currentLang);

  const about = config.about;
  const labels = config.labels;
  const SITE_URL = config.site.url;
  const siteTitle = config.site.title;

  const dataSources = {
    en: [
      { name: 'X / Twitter', count: '25+ builders', color: 'cyan' },
      { name: 'YouTube Podcasts', count: '6 shows', color: 'magenta' },
      { name: 'Company Blogs', count: '2 sources', color: 'green' },
    ],
    zh: [
      { name: 'X / Twitter', count: '25+ 位建设者', color: 'cyan' },
      { name: 'YouTube 播客', count: '6 档节目', color: 'magenta' },
      { name: '公司博客', count: '2 个来源', color: 'green' },
    ],
    ja: [
      { name: 'X / Twitter', count: '25+ 人のビルダー', color: 'cyan' },
      { name: 'YouTube ポッドキャスト', count: '6 番組', color: 'magenta' },
      { name: '公式ブログ', count: '2 ソース', color: 'green' },
    ],
  };

  const pipeline = {
    en: [
      { step: '01', name: 'COLLECT', desc: 'Fetch curated feeds from X/Twitter, YouTube podcasts, and company blogs via public JSON feeds on GitHub.' },
      { step: '02', name: 'REMIX', desc: 'AI reads raw tweets, transcripts, and blog posts. Generates editorial headlines and concise summaries for each piece.' },
      { step: '03', name: 'TRANSLATE', desc: 'Summaries translated to EN/ZH/JA with domain-aware terminology. Technical terms and proper nouns preserved in English.' },
    ],
    zh: [
      { step: '01', name: '采集', desc: '从 GitHub 公开 JSON 信息源获取 X/Twitter、YouTube 播客和公司博客的策划内容。' },
      { step: '02', name: 'AI 提炼', desc: 'AI 阅读原始推文、播客文字稿和博客文章，为每条内容生成编辑标题和精炼摘要。' },
      { step: '03', name: '翻译', desc: '摘要翻译为中英日三语，保留技术术语和专有名词的英文原文。' },
    ],
    ja: [
      { step: '01', name: '収集', desc: 'GitHubの公開JSONフィードからX/Twitter、YouTubeポッドキャスト、企業ブログのコンテンツを取得。' },
      { step: '02', name: 'AI要約', desc: 'AIがツイート、文字起こし、ブログ記事を読み込み、見出しと簡潔な要約を生成。' },
      { step: '03', name: '翻訳', desc: '要約をEN/ZH/JAの3言語に翻訳。技術用語と固有名詞は英語のまま保持。' },
    ],
  };

  const pipelineTitle = { en: 'PIPELINE', zh: '处理流程', ja: 'パイプライン' };
  const disclaimerTitle = { en: 'DISCLAIMER', zh: '免责声明', ja: '免責事項' };

  const aboutPageTitle = $derived(`${about.title[currentLang]} — ${siteTitle[currentLang]}`);
</script>

<svelte:head>
  <title>{aboutPageTitle}</title>
  <meta name="description" content={about.overview[currentLang]} />
  <link rel="canonical" href={`${SITE_URL}/about`} />
  <meta property="og:url" content={`${SITE_URL}/about`} />
  <meta property="og:title" content={aboutPageTitle} />
  <meta property="og:description" content={about.overview[currentLang]} />
  <meta name="twitter:title" content={aboutPageTitle} />
  <meta name="twitter:description" content={about.overview[currentLang]} />
</svelte:head>

<main class="max-w-3xl mx-auto px-6 sm:px-8 pt-14 sm:pt-20 pb-10">

  <!-- Back to top -->
  <a href="/" class="inline-block text-[10px] font-display tracking-[0.2em] text-cyber-cyan/60 hover:text-cyber-cyan transition-colors duration-200 no-underline uppercase mb-6 animate-in">
    ← {{ en: 'BACK', zh: '返回', ja: '戻る' }[currentLang]}
  </a>

  <!-- Hero -->
  <div class="relative mb-14 sm:mb-20 animate-in">
    <div class="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyber-cyan/30 hidden sm:block"></div>
    <div class="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-cyber-cyan/30 hidden sm:block"></div>

    <p class="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan/40 mb-5">
      // SYSTEM.DOCS
    </p>
    <h1 class="font-display text-2xl sm:text-4xl font-black tracking-tight text-cyber-heading mb-6">
      {about.title[currentLang]}
    </h1>
    <p class="text-[13px] sm:text-sm text-cyber-text/80 leading-[1.9] max-w-2xl">
      {about.overview[currentLang]}
    </p>
    <div class="gradient-line mt-8"></div>
  </div>

  <!-- Pipeline -->
  <section class="mb-14 sm:mb-20 animate-in" style="animation-delay: 120ms">
    <div class="flex items-center gap-3 mb-8 sm:mb-10">
      <span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-cyan glow-cyan uppercase">
        {pipelineTitle[currentLang]}
      </span>
      <div class="flex-1 h-px bg-cyber-border"></div>
      <span class="text-[10px] font-mono text-cyber-cyan/25 tabular-nums">03</span>
    </div>

    <div class="relative pl-8 sm:pl-10">
      <div class="absolute left-[9px] sm:left-[11px] top-1 bottom-1 w-px bg-gradient-to-b from-cyber-cyan/30 via-cyber-cyan/10 to-cyber-cyan/5"></div>

      {#each pipeline[currentLang] as item, i}
        <div
          class="relative flex gap-5 sm:gap-6 pb-8 last:pb-0 animate-in"
          style="animation-delay: {180 + i * 100}ms"
        >
          <div
            class="absolute -left-8 sm:-left-10 top-0.5 z-10 w-[19px] sm:w-[23px] h-[19px] sm:h-[23px] rounded-full border border-cyber-cyan/30 bg-cyber-bg flex items-center justify-center"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-cyber-cyan/50"></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2.5 mb-2">
              <span class="font-mono text-[10px] text-cyber-cyan/30 tabular-nums">{item.step}</span>
              <span class="font-display text-[11px] sm:text-[12px] font-bold tracking-[0.15em] text-cyber-heading uppercase">{item.name}</span>
            </div>
            <p class="text-[12px] sm:text-[13px] text-cyber-text/60 leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Data Sources -->
  <section class="mb-14 sm:mb-20 animate-in" style="animation-delay: 600ms">
    <div class="flex items-center gap-3 mb-8 sm:mb-10">
      <span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-magenta glow-magenta uppercase">
        {{ en: 'DATA SOURCES', zh: '数据源', ja: 'データソース' }[currentLang]}
      </span>
      <div class="flex-1 h-px bg-cyber-border"></div>
      <span class="text-[10px] font-mono text-cyber-magenta/25 tabular-nums">03</span>
    </div>

    <div class="space-y-3">
      {#each dataSources[currentLang] as src}
        <div class="flex items-center gap-3 px-4 py-3 border border-cyber-border/40 rounded-sm bg-cyber-surface/30">
          <span class="w-2 h-2 rounded-full bg-cyber-{src.color}/50 shrink-0"></span>
          <span class="text-[12px] font-bold text-cyber-heading tracking-wide">{src.name}</span>
          <span class="flex-1"></span>
          <span class="text-[10px] text-cyber-text-muted tracking-wider font-mono">{src.count}</span>
        </div>
      {/each}
    </div>
  </section>

  <!-- Audience -->
  <section class="mb-14 sm:mb-20 animate-in" style="animation-delay: 800ms">
    <div class="rounded-sm px-5 sm:px-6 py-4 sm:py-5 border border-cyber-border/40 bg-cyber-surface/20">
      <p class="text-[11px] sm:text-[12px] text-cyber-text/80 leading-[1.8]">
        {about.policyAudience[currentLang]}
      </p>
    </div>
  </section>

  <!-- Disclaimer -->
  <section class="animate-in" style="animation-delay: 900ms">
    <div class="rounded-sm px-5 sm:px-6 py-4 sm:py-5 border border-cyber-border/40 bg-cyber-surface/20">
      <p class="text-[10px] font-display tracking-[0.15em] text-cyber-text-muted/70 uppercase mb-2">
        {disclaimerTitle[currentLang]}
      </p>
      <p class="text-[11px] sm:text-[12px] text-cyber-text-muted/90 leading-[1.8]">
        {about.disclaimer[currentLang]}
      </p>
    </div>
  </section>

  <!-- Subscribe -->
  <section class="mt-14 sm:mt-20 animate-in" style="animation-delay: 1000ms">
    <div class="rounded-sm px-5 sm:px-6 py-6 sm:py-8 border border-cyber-border/40 bg-cyber-surface/20 text-center">
      <p class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-cyan glow-cyan uppercase mb-2">
        {labels.stayUpdated[currentLang]}
      </p>
      <p class="text-[11px] sm:text-[12px] text-cyber-text-muted leading-relaxed mb-5">
        {labels.stayUpdatedDesc[currentLang]}
      </p>
      <SubscribeForm lang={currentLang} />
    </div>
  </section>

  <!-- Back -->
  <footer class="pt-10 pb-4 text-center">
    <div class="gradient-line mb-6"></div>
    <a href="/" class="inline-block text-[10px] font-display tracking-[0.2em] text-cyber-text-muted/80 hover:text-cyber-cyan transition-colors duration-200 no-underline uppercase py-2 px-4">
      ← {{ en: 'BACK', zh: '返回', ja: '戻る' }[currentLang]}
    </a>
  </footer>

</main>
