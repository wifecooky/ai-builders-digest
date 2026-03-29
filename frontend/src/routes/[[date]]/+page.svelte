<script>
  import { getContext } from 'svelte';
  import config from '$lib/site-config.js';
  import SubscribeForm from '$lib/components/SubscribeForm.svelte';
  import BuilderCard from '$lib/components/BuilderCard.svelte';
  import PodcastCard from '$lib/components/PodcastCard.svelte';
  import BlogCard from '$lib/components/BlogCard.svelte';

  let { data } = $props();
  const app = getContext('app');
  let currentLang = $derived(app.currentLang);

  let content = $derived(data.content[currentLang]);
  let archiveDates = $derived(data.dates.filter(d => d !== data.date));

  const labels = config.labels;
  const SITE_URL = config.site.url;
  const siteTitle = config.site.title;
  const siteDesc = config.site.description;
  const subtitle = config.site.subtitle;
  const hashtag = config.site.hashtag;

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  let copiedId = $state(null);

  function getPageUrl() {
    return `${SITE_URL}/${content?.date || ''}`;
  }

  function shareToX(title) {
    const text = encodeURIComponent(`${title} ${hashtag[currentLang]}`);
    const link = encodeURIComponent(getPageUrl());
    window.open(`https://x.com/intent/tweet?text=${text}&url=${link}`, '_blank', 'width=550,height=420');
  }

  async function copyLink(id) {
    await navigator.clipboard.writeText(getPageUrl());
    copiedId = id;
    setTimeout(() => { if (copiedId === id) copiedId = null; }, 2000);
  }

  let totalItems = $derived(
    (content?.builderInsights?.length || 0) +
    (content?.podcastHighlights?.length || 0) +
    (content?.blogUpdates?.length || 0)
  );

  let canonicalUrl = $derived(`${SITE_URL}/${content?.date || ''}`);
  let pageTitle = $derived(`${siteTitle[currentLang]} — ${content?.date || 'Today'}`);
  let pageDesc = $derived.by(() => {
    if (!content?.builderInsights?.length) return siteDesc[currentLang];
    const names = content.builderInsights.map(a => a.authorName).slice(0, 3).join(', ');
    const more = totalItems - 3;
    const suffix = { en: ` + ${more} more`, zh: ` 等 ${totalItems} 条`, ja: ` 他${more}件` };
    return more > 0 ? names + suffix[currentLang] : names;
  });
  let jsonLdScript = $derived.by(() => {
    const ld = { '@context': 'https://schema.org', '@type': 'WebPage', name: pageTitle, description: pageDesc, url: canonicalUrl };
    return '<script type="application/ld+json">' + JSON.stringify(ld) + '</' + 'script>';
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDesc} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDesc} />
  <meta name="twitter:url" content={canonicalUrl} />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDesc} />
  {@html jsonLdScript}
</svelte:head>

<main class="max-w-3xl mx-auto px-5">
  {#if !content || totalItems === 0}
    <div class="text-center py-32">
      <p class="text-cyber-text-muted font-display text-sm tracking-widest">{labels.empty[currentLang]}</p>
    </div>
  {:else}

    <!-- Masthead -->
    <div class="pt-14 pb-10 animate-in">
      {#if data.date !== data.latest}
        <a href="/" class="inline-block text-[10px] font-display tracking-[0.2em] text-cyber-amber/70 hover:text-cyber-amber transition-colors duration-200 no-underline uppercase mb-4">
          ← {labels.backToday[currentLang]}
        </a>
      {/if}
      <p class="text-[10px] text-cyber-text-muted uppercase tracking-[0.3em] mb-3 font-display">
        {subtitle[currentLang]}
      </p>
      <h2 class="text-4xl sm:text-5xl font-display font-black tracking-tight text-cyber-heading">
        {formatDate(content.date)}
      </h2>
      <div class="flex items-center gap-3 mt-4">
        <div class="gradient-line flex-1"></div>
        <span class="text-[10px] text-cyber-text-muted tracking-widest font-display tabular-nums">
          {content.metadata?.totalBuilders || 0} {labels.sources[currentLang]}
        </span>
      </div>
    </div>

    <!-- Daily Summary -->
    {#if content.summary}
      <section class="pb-8 animate-in">
        <div class="rounded-sm px-5 sm:px-6 py-5 border border-cyber-accent/20 bg-cyber-accent/5">
          <p class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-accent uppercase mb-2"
            style="text-shadow: 0 0 7px rgba(129, 140, 248, 0.3);">
            TL;DR
          </p>
          <p class="text-sm text-cyber-text leading-relaxed">{content.summary}</p>
        </div>
      </section>
    {/if}

    <!-- Builder Insights -->
    {#if content.builderInsights?.length > 0}
      <section class="pb-8">
        <div class="flex items-center gap-3 mb-8">
          <span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-magenta glow-magenta uppercase">
            {labels.builderInsights[currentLang]}
          </span>
          <div class="flex-1 h-px bg-cyber-border"></div>
          <span class="text-[10px] font-mono text-cyber-magenta/25 tabular-nums">{content.builderInsights.length}</span>
        </div>

        <div class="space-y-6">
          {#each content.builderInsights as article, i}
            <BuilderCard
              {article}
              index={i}
              delay={i * 120}
              onShareX={shareToX}
              onCopy={copyLink}
              {copiedId}
            />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Blog Updates -->
    {#if content.blogUpdates?.length > 0}
      {@const baseDelay = (content.builderInsights?.length || 0) * 120}
      <section class="py-8">
        <div class="flex items-center gap-3 mb-8">
          <span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-green uppercase"
            style="text-shadow: 0 0 7px rgba(52, 211, 153, 0.3);">
            {labels.blogUpdates[currentLang]}
          </span>
          <div class="flex-1 h-px bg-cyber-border"></div>
          <span class="text-[10px] font-mono text-cyber-green/25 tabular-nums">{content.blogUpdates.length}</span>
        </div>

        <div class="space-y-4">
          {#each content.blogUpdates as article, i}
            <BlogCard {article} delay={baseDelay + i * 100} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Podcast Highlights -->
    {#if content.podcastHighlights?.length > 0}
      {@const baseDelay = ((content.builderInsights?.length || 0) + (content.blogUpdates?.length || 0)) * 100}
      <section class="py-8">
        <div class="flex items-center gap-3 mb-8">
          <span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-amber uppercase"
            style="text-shadow: 0 0 7px rgba(251, 191, 36, 0.3);">
            {labels.podcastHighlights[currentLang]}
          </span>
          <div class="flex-1 h-px bg-cyber-border"></div>
          <span class="text-[10px] font-mono text-cyber-amber/25 tabular-nums">{content.podcastHighlights.length}</span>
        </div>

        <div class="space-y-4">
          {#each content.podcastHighlights as article, i}
            <PodcastCard {article} delay={baseDelay + i * 100} />
          {/each}
        </div>
      </section>
    {/if}

    <!-- Newsletter Subscribe -->
    <section class="py-8">
      <div class="rounded-sm px-5 sm:px-6 py-6 border border-cyber-border/40 bg-cyber-surface/20 text-center">
        <p class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-cyan glow-cyan uppercase mb-2">
          {labels.stayUpdated[currentLang]}
        </p>
        <p class="text-[11px] text-cyber-text-muted/70 leading-relaxed mb-4">
          {labels.stayUpdatedDesc[currentLang]}
        </p>
        <SubscribeForm lang={currentLang} />
      </div>
    </section>

    <!-- Archive -->
    {#if archiveDates.length > 0}
      <section class="py-8">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-[10px] font-display font-bold tracking-[0.3em] text-cyber-amber uppercase"
            style="text-shadow: 0 0 7px rgba(251, 191, 36, 0.3);">
            {labels.archive[currentLang]}
          </span>
          <div class="flex-1 h-px bg-cyber-border"></div>
        </div>

        <div class="flex flex-wrap gap-2">
          {#each archiveDates as d}
            {@const isCurrent = d === data.date}
            <a
              href="/{d}"
              class="text-[11px] font-mono tabular-nums px-3 py-1.5 rounded-sm border transition-all duration-200 no-underline
                {isCurrent
                  ? 'border-cyber-amber/40 bg-cyber-amber/10 text-cyber-amber'
                  : 'border-cyber-border/50 text-cyber-text-muted hover:border-cyber-amber/30 hover:text-cyber-amber/80 hover:bg-cyber-amber/5'}"
            >
              {d}
            </a>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Footer -->
    <footer class="py-10 text-center">
      <div class="gradient-line mb-6"></div>
      <p class="text-[10px] text-cyber-text-muted tracking-widest font-display tabular-nums">
        {content.metadata?.generatedAt ? new Date(content.metadata.generatedAt).toLocaleString() : ''}
      </p>
      <p class="text-[10px] text-cyber-text-muted/50 tracking-wider font-display mt-2 flex items-center justify-center gap-3">
        <a href="/about" class="hover:text-cyber-cyan transition-colors duration-200 no-underline">ABOUT</a>
        <span class="text-cyber-border">·</span>
        <a href={({en: '/rss.xml', zh: '/rss-zh.xml', ja: '/rss-ja.xml'})[currentLang]} class="hover:text-cyber-amber transition-colors duration-200 no-underline" target="_blank" rel="noopener noreferrer">RSS</a>
        <span class="text-cyber-border">·</span>
        <a href="https://github.com/zarazhangrui/follow-builders" class="hover:text-cyber-green transition-colors duration-200 no-underline" target="_blank" rel="noopener noreferrer">GITHUB</a>
      </p>
    </footer>

  {/if}
</main>
