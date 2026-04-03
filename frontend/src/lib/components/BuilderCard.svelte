<script>
  import { renderMarkdown } from '$lib/markdown.js';

  let { article, index = 0, delay = 0, onShareX, onCopy, copiedId, highlight = false } = $props();

  let displayTitle = $derived(article.suggestedTitle || article.title);
  let displaySummary = $derived(article.suggestedSummary || '');
  let renderedSummary = $derived(renderMarkdown(displaySummary));

  function roleFromBio(bio) {
    if (!bio) return '';
    const lower = bio.toLowerCase();
    if (lower.includes('ceo')) return 'CEO';
    if (lower.includes('cto')) return 'CTO';
    if (lower.includes('vp')) return 'VP';
    if (lower.includes('founder')) return 'Founder';
    if (lower.includes('partner')) return 'Partner';
    if (lower.includes('head of')) return bio.match(/head of \w+/i)?.[0] || '';
    if (lower.includes('director')) return 'Director';
    return '';
  }

  let role = $derived(roleFromBio(article.authorBio));
  let companyMatch = $derived(article.authorBio?.match(/@(\w+)/));
  let company = $derived(companyMatch ? companyMatch[1] : '');
  let authorLabel = $derived([role, company].filter(Boolean).join(', '));
</script>

<article
  class="group relative border-l-2 border-l-cyber-cyan/30 border border-cyber-border rounded-sm p-5 sm:p-6 transition-all duration-300 hover:border-l-cyber-cyan/60 hover:bg-cyber-surface/80 animate-in
    {highlight ? 'bg-cyber-cyan/[0.03]' : 'bg-cyber-surface/40'}"
  style="animation-delay: {delay}ms"
>
  <div class="flex items-start gap-4">
    <span class="font-display text-3xl sm:text-4xl font-black text-cyber-cyan/15 leading-none select-none tabular-nums shrink-0">
      {String(index + 1).padStart(2, '0')}
    </span>
    <div class="flex-1 min-w-0">
      <!-- Author -->
      <div class="flex items-center gap-2.5 mb-2">
        <img
          src={`https://unavatar.io/x/${article.authorHandle}`}
          alt={article.authorName}
          width="24"
          height="24"
          loading="lazy"
          class="w-6 h-6 rounded-full ring-1 ring-cyber-border shrink-0"
        />
        <span class="text-[11px] font-bold text-cyber-heading">{article.authorName}</span>
        {#if authorLabel}
          <span class="text-[10px] text-cyber-text-muted">{authorLabel}</span>
        {/if}
      </div>

      <!-- Headline -->
      <h3 class="text-base sm:text-lg font-bold leading-snug text-cyber-heading mb-3 tracking-tight">
        {displayTitle}
      </h3>

      <!-- Summary -->
      <div class="text-[13px] text-cyber-text leading-relaxed mb-4 opacity-85 space-y-2">
        {#key renderedSummary}{@html renderedSummary}{/key}
      </div>

      <!-- Tweet links -->
      {#if article.tweets?.length > 0}
        <div class="flex flex-wrap gap-2 mb-3">
          {#each article.tweets as tweet, i}
            <a
              href={tweet.url}
              target="_blank"
              rel="noopener noreferrer"
              class="text-[10px] px-2 py-0.5 rounded-sm bg-cyber-cyan/8 text-cyber-cyan/70 border border-cyber-cyan/15 hover:border-cyber-cyan/30 hover:text-cyber-cyan transition-colors duration-200 no-underline inline-flex items-center gap-1.5"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="opacity-60"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              {#if article.tweets.length > 1}
                <span class="opacity-40">#{i + 1}</span>
              {/if}
              {#if tweet.likes > 100}
                <span class="opacity-60">{tweet.likes > 1000 ? `${(tweet.likes / 1000).toFixed(1)}k` : tweet.likes}</span>
              {/if}
            </a>
          {/each}
        </div>
      {/if}

      <!-- Footer -->
      <div class="flex items-center gap-2">
        <span class="text-[10px] text-cyber-text-muted tracking-wider uppercase font-display">X</span>
        <span class="flex-1"></span>
        <button onclick={() => onShareX?.(displayTitle)} class="p-1 text-cyber-text-muted/40 hover:text-cyber-cyan transition-colors duration-200" title="Share on X">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>
        <button onclick={() => onCopy?.(article.id)} class="p-1 text-cyber-text-muted/40 hover:text-cyber-cyan transition-colors duration-200" title="Copy link">
          {#if copiedId === article.id}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          {:else}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          {/if}
        </button>
      </div>
    </div>
  </div>
</article>
