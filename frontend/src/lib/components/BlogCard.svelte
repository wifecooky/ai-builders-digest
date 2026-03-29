<script>
  let { article, delay = 0 } = $props();

  const displayTitle = article.suggestedTitle || article.title;
  const displaySummary = article.suggestedSummary || '';
</script>

<article
  class="group relative border border-cyber-border rounded-sm p-5 sm:p-6 transition-all duration-300 hover:border-cyber-green/40 bg-cyber-surface/60 animate-in"
  style="animation-delay: {delay}ms"
>
  <div class="mb-2">
    <span class="text-[10px] text-cyber-green/50 tracking-wider uppercase font-display">{article.source}</span>
    {#if article.author}
      <span class="text-[10px] text-cyber-text-muted ml-2">by {article.author}</span>
    {/if}
  </div>

  <h3 class="text-base sm:text-lg font-bold leading-snug text-cyber-heading mb-3 tracking-tight">
    {#if article.url}
      <a href={article.url} target="_blank" rel="noopener noreferrer" class="hover:text-cyber-green transition-colors duration-200 no-underline">{article.title}</a>
    {:else}
      {article.title}
    {/if}
  </h3>

  {#if displayTitle !== article.title}
    <p class="text-[12px] text-cyber-green/70 font-bold mb-2">{displayTitle}</p>
  {/if}

  <p class="text-[13px] text-cyber-text leading-relaxed opacity-85">
    {displaySummary}
  </p>

  {#if article.url}
    <div class="mt-3">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        class="text-[10px] px-2 py-0.5 rounded-sm bg-cyber-green/8 text-cyber-green/70 border border-cyber-green/15 hover:border-cyber-green/30 transition-colors duration-200 no-underline"
      >
        Read original
      </a>
    </div>
  {/if}
</article>
