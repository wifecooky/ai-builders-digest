<script>
  import { renderMarkdown } from '$lib/markdown.js';

  let { item, index = 0, delay = 0, onShareX, onCopy, copiedId } = $props();

  let displayTitle = $derived(item.suggestedTitle || item.title);
  let displaySummary = $derived(item.suggestedSummary || '');
  let renderedSummary = $derived(renderMarkdown(displaySummary));

  const SOURCE_STYLES = {
    X: { color: 'cyan', icon: 'X' },
    podcast: { color: 'magenta', icon: '▶' },
    blog: { color: 'green', icon: '◆' },
  };

  let sourceType = $derived(
    item.category === 'podcastHighlights' ? 'podcast' :
    item.category === 'blogUpdates' ? 'blog' : 'X'
  );
  let style = $derived(SOURCE_STYLES[sourceType]);
</script>

<article
  class="group relative border border-cyber-border rounded-sm p-5 sm:p-6 transition-all duration-300 hover:border-cyber-{style.color}/40 bg-cyber-surface/60 animate-in"
  style="animation-delay: {delay}ms"
>
  <!-- Top row: source badge + author -->
  <div class="flex items-center gap-2 mb-3">
    <span
      class="text-[9px] font-mono px-1.5 py-0.5 rounded-sm border
        bg-cyber-{style.color}/8 text-cyber-{style.color}/70 border-cyber-{style.color}/20"
    >
      {style.icon}
    </span>
    {#if item.authorName}
      <span class="text-[11px] font-bold text-cyber-heading">{item.authorName}</span>
    {:else if item.source}
      <span class="text-[11px] font-bold text-cyber-heading">{item.source}</span>
    {/if}
    {#if item.authorName && item.source && item.source !== 'X'}
      <span class="text-[10px] text-cyber-text-muted">via {item.source}</span>
    {/if}
  </div>

  <!-- Headline -->
  <h3 class="text-base sm:text-lg font-bold leading-snug text-cyber-heading mb-2 tracking-tight">
    {#if item.url}
      <a href={item.url} target="_blank" rel="noopener noreferrer" class="hover:text-cyber-{style.color} transition-colors duration-200 no-underline">
        {displayTitle}
      </a>
    {:else}
      {displayTitle}
    {/if}
  </h3>

  <!-- Summary -->
  <div class="text-[13px] text-cyber-text leading-relaxed opacity-85 mb-3 space-y-2">
    {@html renderedSummary}
  </div>

  <!-- Tweet links / source links -->
  <div class="flex items-center flex-wrap gap-2">
    {#if item.tweets?.length > 0}
      {#each item.tweets as tweet}
        <a
          href={tweet.url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-[10px] px-2 py-0.5 rounded-sm bg-cyber-cyan/8 text-cyber-cyan/70 border border-cyber-cyan/15 hover:border-cyber-cyan/30 transition-colors duration-200 no-underline inline-flex items-center gap-1.5"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="opacity-60"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          {#if tweet.likes > 100}
            <span class="opacity-60">{tweet.likes > 1000 ? `${(tweet.likes / 1000).toFixed(1)}k` : tweet.likes}</span>
          {/if}
        </a>
      {/each}
    {:else if item.url}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        class="text-[10px] px-2 py-0.5 rounded-sm bg-cyber-{style.color}/8 text-cyber-{style.color}/70 border border-cyber-{style.color}/15 hover:border-cyber-{style.color}/30 transition-colors duration-200 no-underline"
      >
        {sourceType === 'podcast' ? 'Watch' : 'Read'} →
      </a>
    {/if}

    <span class="flex-1"></span>

    {#if onShareX}
      <button onclick={() => onShareX?.(displayTitle)} class="p-1 text-cyber-text-muted/40 hover:text-cyber-cyan transition-colors duration-200" title="Share on X">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </button>
    {/if}
    {#if onCopy}
      <button onclick={() => onCopy?.(item.id)} class="p-1 text-cyber-text-muted/40 hover:text-cyber-cyan transition-colors duration-200" title="Copy link">
        {#if copiedId === item.id}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        {:else}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        {/if}
      </button>
    {/if}
  </div>
</article>
